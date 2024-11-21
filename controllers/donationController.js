const moment = require('moment');
const User = require('../models/User');
const Donation = require('../models/Donation');
const jwt = require('jsonwebtoken');

// registrar uma nova doação
const registerDonation = (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido!' });
    }

    const tokenValue = token.split(' ')[1];

    // decodificar o token
    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido ou expirado!' });
        }

        const { data_doacao, local } = req.body;
        if (!data_doacao || !local) {
            return res.status(400).json({ message: 'Data e local da doação são obrigatórios!' });
        }

        // próxima data de doação (3 meses depois)
        const nextDonationDate = moment(data_doacao).add(3, 'months').format('YYYY-MM-DD');

        // registrar doação no banco de dados
        Donation.createDonation(decoded.userId, data_doacao, local, nextDonationDate, (err, donationId) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao registrar doação', error: err.message });
            }

            res.status(201).json({ message: 'Doação registrada com sucesso!', donationId, nextDonationDate });
        });
    });
};


// obter o histórico de doações
const getDonationHistory = (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido!' });
    }

    const tokenValue = token.split(' ')[1];

    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido ou expirado!' });
        }

        const { page = 1, limit = 5 } = req.query; // Define valores padrão para página e limite
        Donation.findDonationsByUserId(decoded.userId, parseInt(page), parseInt(limit), (err, donations, totalCount) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao buscar histórico de doações', error: err.message });
            }

            const totalPages = Math.ceil(totalCount / limit);  // Calcula o total de páginas
            res.status(200).json({ donations, totalPages });  // Retorna doações e total de páginas
        });
    });
};

const updateDonation = (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido!' });
    }

    const tokenValue = token.split(' ')[1];
    console.log('Token enviado:', tokenValue);

    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Erro ao verificar token:', err);
            return res.status(401).json({ message: 'Token inválido ou expirado!' });
        }

        const userId = decoded.userId;
        const { donationId } = req.params;
        console.log('Editando doação com ID:', donationId, 'para o usuário:', userId);

        const { data_doacao, local } = req.body;
        if (!data_doacao || !local) {
            return res.status(400).json({ message: 'Data e local da doação são obrigatórios!' });
        }

        // verificar se a doação existe e pertence ao usuário
        Donation.findDonationByIdAndUser(donationId, userId, (err, donation) => {
            if (err) {
                console.log('Erro ao buscar a doação:', err);
                return res.status(500).json({ message: 'Erro ao buscar a doação', error: err.message });
            }

            if (!donation) {
                console.log('Doação não encontrada ou não pertence ao usuário');
                return res.status(404).json({ message: 'Doação não encontrada ou não pertence ao usuário!' });
            }

            // atualizar a doação
            Donation.updateDonation(donationId, data_doacao, local, (err) => {
                if (err) {
                    console.log('Erro ao atualizar a doação:', err);
                    return res.status(500).json({ message: 'Erro ao atualizar a doação', error: err.message });
                }

                res.status(200).json({ message: 'Doação atualizada com sucesso!' });
            });
        });
    });
};

const deleteDonation = (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido!' });
    }

    const tokenValue = token.split(' ')[1];
    console.log('Token enviado:', tokenValue);

    jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Erro ao verificar token:', err);
            return res.status(401).json({ message: 'Token inválido ou expirado!' });
        }

        const userId = decoded.userId;
        const { donationId } = req.params;
        console.log('Deletando doação com ID:', donationId, 'para o usuário:', userId);

        // verif se a doação existe e pertence ao usuário
        Donation.findDonationByIdAndUser(donationId, userId, (err, donation) => {
            if (err) {
                console.log('Erro ao buscar a doação:', err);
                return res.status(500).json({ message: 'Erro ao buscar a doação', error: err.message });
            }

            if (!donation) {
                console.log('Doação não encontrada ou não pertence ao usuário');
                return res.status(404).json({ message: 'Doação não encontrada ou não pertence ao usuário!' });
            }

            // deletar a doação
            Donation.deleteDonation(donationId, (err) => {
                if (err) {
                    console.log('Erro ao deletar a doação:', err);
                    return res.status(500).json({ message: 'Erro ao deletar a doação', error: err.message });
                }

                res.status(200).json({ message: 'Doação deletada com sucesso!' });
            });
        });
    });
};


module.exports = { getDonationHistory, registerDonation, updateDonation, deleteDonation };
