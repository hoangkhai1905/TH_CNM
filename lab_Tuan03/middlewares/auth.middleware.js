function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        // Or render a 403 page
        return res.status(403).send('<h1>403 Forbidden: Access Denied</h1><a href="/">Go Home</a>');
    }
    next();
}

module.exports = { requireAuth, requireAdmin };
