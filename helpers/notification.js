const Contract = require('../models/Contract');

// LOGICA BULLET
// Un contrato se crea por defecto con estado: pendiente.
// Mostrar bullet cuando:
// Un padre o canguro ha solicitado canguro y le han aceptado o rechazado.
// Un canguro ha recibido solicitud de padre o canguro.

const checkBullet = async (currentUser) => {
  try {
    let showBullet = false;
    if (currentUser) {
      // Todos los contratos que ha solicitado el padre o canguro actual a otros canguros.
      const contractParent = await Contract.find({ parent: currentUser._id }).lean();
      // Todos los contratos que ha recibido el canguro actual de padres u otros canguros.
      const contractBabysitter = await Contract.find({ babysitter: currentUser._id }).lean();
      if (contractBabysitter.length > 0) {
        contractBabysitter.forEach((babysitter) => {
          if (babysitter.state === 'Pendiente') {
            showBullet = true;
          }
        });
      }
      if (contractParent.length > 0) {
        contractParent.forEach((parent) => {
          if (parent.state !== 'Pendiente') {
            showBullet = true;
          }
        });
      }
    }
    return showBullet;
  } catch (error) {

  }
};

module.exports = checkBullet;

function findOdd (A) {
  let sum = 0;
  A.forEach((b) => {
    if (b % 1 !== 0) {
      sum++;
    }
  });

  return sum;
}
