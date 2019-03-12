var express = require('express');
const Contract = require('../models/Contract');
const User = require('../models/User');
const { userIsNotLogged } = require('../middlewares/auth');
const parser = require('../helpers/file-upload');

var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const babySitterArray = await User.find({ userType: 'babysitter' });
    res.render('home', { babySitterArray });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', userIsNotLogged, async (req, res, next) => {
  try {
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// LOGICA MESSAGE
// Un contrato se crea por defecto con estado: pendiente.
// Mostrar mensajes cuando:
// Un padre o canguro ha solicitado canguro y le han aceptado o rechazado.
// Un canguro ha recibido solicitud de padre o canguro.

router.get('/profile/message', userIsNotLogged, async (req, res, next) => {
  try {
    const currentUser = req.session.currentUser;
    if (currentUser) {
      // Todos los contratos que ha solicitado el padre o canguro actual a otros canguros.
      const contractParent = await Contract.find({ parent: currentUser._id }).populate('babysitter');
      // Todos los contratos que ha recibido el canguro actual de padres u otros canguros.
      const contractBabysitter = await Contract.find({ babysitter: currentUser._id }).populate('parent');
      // Contratos que ha recibido la canguro con estado pendiente.
      const filterStateBabysitter = contractBabysitter.filter((babysitter) => {
        return babysitter.state === 'Pendiente';
      });
      // Contratos de los padres o conguros que han solicitado canguro con estado feedback.
      const filterStateFeedback = contractParent.filter((contract) => {
        return contract.state === 'Feedback';
      });
      // Contratos de los padres o canguros que han solicitado canguro con estado aceptado o rechazado.
      const filterStateParent = contractParent.filter((parent) => {
        return parent.state !== 'Pendiente' && parent.state !== 'Feedback';
      });
      res.render('message', { filterStateParent, filterStateBabysitter, filterStateFeedback });
    }
  } catch (error) {
    next(error);
  }
});

// El canguro actualiza el estado de la solicitud a 'Aceptado'
router.get('/profile/message/:id/accept', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contract.findByIdAndUpdate(id, { state: 'Aceptado' });

    res.redirect('/profile/message');
  } catch (error) {
    next(error);
  }
});

// El canguro actualiza el estado de la solicitud a 'Denegado'
router.get('/profile/message/:id/decline', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contract.findByIdAndUpdate(id, { state: 'Denegado' });

    res.redirect('/profile/message');
  } catch (error) {
    next(error);
  }
});

// Feedback
router.get('/profile/message/:id/feedback', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contract.findByIdAndUpdate(id, { state: 'Feedback' });
    res.redirect('/profile/message');
  } catch (error) {
    next(error);
  }
});

// Positive feedback
router.get('/profile/message/:id/feedback/yes', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByIdAndUpdate(id, { state: 'Feedback' });
    const babysitter = await User.findById(contract.babysitter);
    let totalFeedback = babysitter.totalFeedback;
    let positiveFeedback = babysitter.positiveFeedback;
    totalFeedback++;
    positiveFeedback++;
    await User.findByIdAndUpdate(contract.babysitter, { totalFeedback, positiveFeedback });

    res.redirect(`/profile/message/${id}/delete`);
  } catch (error) {
    next(error);
  }
});

// Negative feedback
router.get('/profile/message/:id/feedback/no', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByIdAndUpdate(id, { state: 'Feedback' });
    const babysitter = await User.findById(contract.babysitter);
    let totalFeedback = babysitter.totalFeedback;
    totalFeedback++;
    await User.findByIdAndUpdate(contract.babysitter, { totalFeedback });
    res.redirect(`/profile/message/${id}/delete`);
  } catch (error) {
    next(error);
  }
});

// Eliminar mensaje después de marcar como recibida la respuesta del canguro.
router.get('/profile/message/:id/delete', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contract.findByIdAndDelete(id);
    res.redirect('/profile/message');
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id', userIsNotLogged, async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.session.currentUser;
  let isMyUser = false;
  let isBabySitter = false;
  try {
    const userSelected = await User.findById(id);
    if (id === currentUser._id) {
      console.log(currentUser.userType);
      isMyUser = true;
    } else if (!isMyUser && userSelected.userType === 'babysitter') {
      isBabySitter = true;
    }

    res.render('profile', { userSelected, isMyUser, isBabySitter });
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id/edit', userIsNotLogged, async (req, res, next) => {
  try {
    res.render('edit-profile');
  } catch (error) {
    next(error);
  }
});

// Crear contrato
router.get('/profile/:id/hire', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = {};
    // Solicitud por parte del usuario logeado
    contract.parent = req.session.currentUser._id;
    // Canguro que se solicita contratar
    contract.babysitter = id;
    await Contract.create(contract);

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/profile/:id/update', userIsNotLogged, parser.single('image'), async (req, res, next) => {
  const { username, description } = req.body;
  const { id } = req.params;
  try {
    let editUser = {};
    if (req.file) {
      editUser = {
        username,
        description,
        imageUrl: req.file.url
      };
    } else {
      editUser = {
        username,
        description
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, editUser, { new: true });
    req.session.currentUser = updatedUser;
    res.redirect(`/profile/${id}`);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/:id/delete', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    delete req.session.currentUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
