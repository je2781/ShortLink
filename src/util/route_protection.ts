export const isAuth = (req: any, res: any, next: any) => {
    if(!req.session.isLoggedIn){
        return res.status(302).redirect('/login');
    }

    next();
}