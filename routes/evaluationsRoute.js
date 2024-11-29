const express = require('express');
const router = express.Router();
const evaluationsController = require('../controllers/EvaluationsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

/**
 * @module routes/evaluations
 */

/**
 * @route GET /evaluations
 * @group Evaluations - Operations about evaluations
 * @security JWT
 * @returns {Array.<Evaluation>} 200 - An array of evaluations
 * @returns {Error}  default - Unexpected error
 */
router.get('/', authMiddleware, evaluationsController.getAllEvaluations);

/**
 * @route GET /evaluations/{eval_id}
 * @param {number} eval_id.path.required - ID de l'évaluation
 * @group Evaluations - Operations about evaluations
 * @security JWT
 * @returns {Evaluation} 200 - Une évaluation
 * @returns {Error}  default - Évaluation non trouvée
 */
router.get('/:eval_id', authMiddleware, evaluationsController.getEvaluationById);

/**
 * @route POST /evaluations/add
 * @group Evaluations - Operations about evaluations
 * @param {Evaluation.model} Evaluation.body.required - Évaluation à créer
 * @security JWT
 * @returns {Evaluation} 201 - Évaluation créée
 * @returns {Error}  default - Unexpected error
 */
router.post('/add', authMiddleware, evaluationsController.createEvaluation);

/**
 * @route PUT /evaluations/update/{eval_id}
 * @param {number} eval_id.path.required - ID de l'évaluation
 * @param {Evaluation.model} Evaluation.body.required - Évaluation à mettre à jour
 * @security JWT
 * @group Evaluations - Operations about evaluations
 * @returns {Evaluation} 200 - Évaluation mise à jour
 * @returns {Error}  default - Évaluation non trouvée ou échec de la mise à jour
 */
router.put('/update/:eval_id', authMiddleware, adminMiddleware, evaluationsController.updateEvaluation);

/**
 * @route DELETE /evaluations/delete/{eval_id}
 * @param {number} eval_id.path.required - ID de l'évaluation
 * @group Evaluations - Operations about evaluations
 * @security JWT
 * @returns {Success} 204 - Évaluation supprimée
 * @returns {Error}  default - Évaluation non trouvée ou échec de la suppression
 */
router.delete('/delete/:eval_id', authMiddleware, adminMiddleware, evaluationsController.deleteEvaluation);

module.exports = router;