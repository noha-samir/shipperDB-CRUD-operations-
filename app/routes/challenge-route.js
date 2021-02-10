var router = require('express').Router();
var ChallengeController = require('../controllers/challenge-controller');
var ChallengeValidation = require('../validations/challenge-validation');

router.get('/all', ChallengeController.controllerGetAllChallenges);

router.get('/:challengeId',ChallengeValidation.validParamsId, ChallengeController.controllerGetChallengeById);

router.post('/',ChallengeValidation.validChallengeInsertion, ChallengeController.controllerInsertChallenge);

router.put('/',ChallengeValidation.validChallengeModification, ChallengeController.controllerUpdateChallenge);

router.delete('/:challengeId',ChallengeValidation.validParamsId, ChallengeController.controllerDeleteChallenge);

module.exports = router;