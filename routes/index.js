var express = require('express');
const Contract = require('../models/Contract');
const User = require('../models/User');
const { userIsNotLogged } = require('../middlewares/auth');
const { deleteContractMiddleWare, isIdValid } = require('../middlewares/index');
const parser = require('../helpers/file-upload');

var router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const currentUser = req.session.currentUser;
    let babySitterArray = await User.find({ userType: 'babysitter' });
    // Si estas login mostrar todos los canguros menos tu el tuyo.
    if (currentUser) {
      babySitterArray = babySitterArray.filter(babysitter => {
        return babysitter._id.toString() !== currentUser._id;
      });
    }
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
    let noMessages = false;
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

      filterStateParent.forEach(parent => {
        if (parent.state === 'Denegado') {
          parent.denegado = true;
        } else {
          parent.denegado = false;
        }
      });

      if (filterStateBabysitter.length === 0 && filterStateFeedback.length === 0 && filterStateParent.length === 0) {
        noMessages = true;
      }
      res.render('message', { filterStateParent, filterStateBabysitter, filterStateFeedback, noMessages });
    }
  } catch (error) {
    next(error);
  }
});

// El canguro actualiza el estado de la solicitud a 'Aceptado'
router.get('/profile/message/:id/accept', userIsNotLogged, isIdValid, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByIdAndUpdate(id, { state: 'Aceptado' });
    if (!contract) {
      next();
      return;
    }
    res.redirect('/profile/message');
  } catch (error) {
    next(error);
  }
});

// El canguro actualiza el estado de la solicitud a 'Denegado'
router.get('/profile/message/:id/decline', userIsNotLogged, isIdValid, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByIdAndUpdate(id, { state: 'Denegado' });
    if (!contract) {
      next();
      return;
    }
    res.redirect('/profile/message');
  } catch (error) {
    next(error);
  }
});

router.post('/profile/message/:id/delete', userIsNotLogged, isIdValid, (req, res, next) => {
  next();
}, deleteContractMiddleWare);

// Mostrar la lista de mensajes con feedback pendiente
router.get('/profile/message/:id/feedback', userIsNotLogged, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByIdAndUpdate(id, { state: 'Feedback' });
    if (!contract) {
      next();
      return;
    }
    res.redirect('/profile/message');
  } catch (error) {
    next(error);
  }
});

// Asignamos la valoración correspondiente al usuario en función de lo que ha indicado en la vista
router.post('/profile/message/:id/feedback/:answer', userIsNotLogged, isIdValid, async (req, res, next) => {
  try {
    const { id, answer } = req.params;
    const contract = await Contract.findByIdAndUpdate(id, { state: 'Feedback' });
    if (!contract) {
      next();
      return;
    }
    const babysitter = await User.findById(contract.babysitter);
    let totalFeedback = babysitter.totalFeedback;
    let positiveFeedback = babysitter.positiveFeedback;
    if (answer === 'yes') {
      totalFeedback++;
      positiveFeedback++;
    } else {
      totalFeedback++;
    }

    await User.findByIdAndUpdate(contract.babysitter, { totalFeedback, positiveFeedback });
    next();
  } catch (error) {
    next(error);
  }
}, deleteContractMiddleWare);

router.get('/profile/edit', userIsNotLogged, async (req, res, next) => {
  try {
    res.render('edit-profile');
  } catch (error) {
    next(error);
  }
});

// Positive & Negative feedback

router.get('/profile/:id', userIsNotLogged, isIdValid, async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.session.currentUser;
  let isMyUser = false;
  let isBabySitter = false;
  try {
    const userSelected = await User.findById(id);
    if (!userSelected) {
      next();
      return;
    }
    if (id === currentUser._id) {
      isMyUser = true;
    } else if (!isMyUser && userSelected.userType === 'babysitter') {
      isBabySitter = true;
    }

    res.render('profile', { userSelected, isMyUser, isBabySitter });
  } catch (error) {
    next(error);
  }
});

// Crear contrato
router.get('/profile/:id/hire', userIsNotLogged, isIdValid, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      next();
      return;
    }
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

router.post('/profile/:id/update', userIsNotLogged, isIdValid, parser.single('image'), async (req, res, next) => {
  const { username, description } = req.body;
  const { id } = req.params;
  try {
    let editUser = {};
    if (req.file) {
      editUser = {
        username,
        description,
        imageUrl: req.file.secure_url
      };
    } else {
      editUser = {
        username,
        description
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, editUser, { new: true });
    if (!updatedUser) {
      next();
      return;
    }
    req.session.currentUser = updatedUser;
    res.redirect(`/profile/${id}`);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/:id/delete', userIsNotLogged, isIdValid, async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    if (!User) {
      next();
      return;
    }
    delete req.session.currentUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
