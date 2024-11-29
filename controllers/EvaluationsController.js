const { Evaluations } = require('../Models');

/**
 * Obtenir toutes les évaluations.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluations.findAll({
            attributes: [
                'eval_id',
                'eval_note',
                'eval_coment',
                'eval_date',
            ],
        });
        return res.status(200).json(evaluations);
    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations :', error);
        return res.status(500).json({ error: 'Une erreur est survenue.' });
    }
};

/**
 * Obtenir une évaluation spécifique par ID.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getEvaluationById = async (req, res) => {
    try {
        const { eval_id } = req.params;
        const evaluation = await Evaluations.findOne({
            where: { eval_id },
            attributes: [
                'eval_id',
                'eval_note',
                'eval_coment',
                'eval_date',
            ],
        });

        if (!evaluation) {
            return res.status(404).json({ message: 'Évaluation non trouvée.' });
        }

        return res.status(200).json(evaluation);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'évaluation :', error);
        return res.status(500).json({ error: 'Une erreur est survenue.' });
    }
};

/**
 * Créer une nouvelle évaluation.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createEvaluation = async (req, res) => {
    const { eval_note, eval_coment, eval_date } = req.body;

    if (!eval_note || !eval_coment || !eval_date) {
        return res.status(400).json({ error: 'Les champs "eval_note", "eval_coment" et "eval_date" sont requis.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const evaluation = await Evaluations.create({
            eval_note,
            eval_coment,
            eval_date,
        });

        return res.status(201).json(evaluation);
    } catch (error) {
        console.error('Erreur lors de la création de l\'évaluation :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la création.' });
    }
};

/**
 * Mettre à jour une évaluation existante.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateEvaluation = async (req, res) => {
    const { eval_id } = req.params;
    const { eval_note, eval_coment, eval_date } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const [updated] = await Evaluations.update(
            { eval_note, eval_coment, eval_date },
            { where: { eval_id } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Évaluation non trouvée.' });
        }

        return res.status(200).json({ message: 'Évaluation mise à jour.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'évaluation :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour.' });
    }
};

/**
 * Supprimer une évaluation.
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteEvaluation = async (req, res) => {
    try {
        const { eval_id } = req.params;
        const deleted = await Evaluations.destroy({ where: { eval_id } });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Évaluation non trouvée.' });
        }        

        return res.status(200).json({ message: 'Évaluation supprimée.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'évaluation :', error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la suppression.' });
    }
};