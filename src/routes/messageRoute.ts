import { Router } from 'express';
const messageRoute = Router();

messageRoute.get('/', (req, res) => {
  res.render('messages');
});
export default messageRoute;
