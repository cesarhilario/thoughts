import type { Request, Response } from 'express';
import { Thought } from '../models/Thought';
import { User } from '../models/User';

const { Op } = require('sequelize');

export class ThoughController {
  async dashboard(req: Request, res: Response) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Thought,
      plain: true,
    });

    const thoughts = user?.Thoughts?.map((result) => result.dataValues);

    let emptyThoughts = true;

    if (thoughts && thoughts.length > 0) {
      emptyThoughts = false;
    }

    res.render('thoughts/dashboard', { thoughts, emptyThoughts });
  }

  createThought(req: Request, res: Response) {
    res.render('thoughts/create');
  }

  createThoughtSave(req: Request, res: Response) {
    const thought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    Thought.create(thought)
      .then(() => {
        req.flash('message', 'Pensamento criado com sucesso!');
        req.session.save(() => {
          res.redirect('/thoughts/dashboard');
        });
      })
      .catch((err) => console.log());
  }

  static showThoughts(req: Request, res: Response) {
    console.log(req.query);

    // check if user is searching
    let search = '';

    if (req.query.search) {
      search = req.query.search.toString();
    }

    // order results, newest first
    let order = 'DESC';

    if (req.query.order === 'old') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }

    Thought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', order]],
    })
      .then((data) => {
        let thoughtsQty = true;

        if (data.length === 0) {
          thoughtsQty = false;
        }

        const thoughts = data.map((result) => result.get({ plain: true }));

        res.render('thoughts/home', { thoughts, thoughtsQty, search });
      })
      .catch((err) => console.log(err));
  }

  removeThought(req: Request, res: Response) {
    const id = req.body.id;

    Thought.destroy({ where: { id: id } })
      .then(() => {
        req.flash('message', 'Pensamento removido com sucesso!');
        req.session.save(() => {
          res.redirect('/thoughts/dashboard');
        });
      })
      .catch((err) => console.log());
  }

  updateThought(req: Request, res: Response) {
    const id = req.params.id;

    Thought.findOne({ where: { id: id }, raw: true })
      .then((thought) => {
        res.render('thoughts/edit', { thought });
      })
      .catch((err) => console.log());
  }

  updateThoughtPost(req: Request, res: Response) {
    const id = req.body.id;

    const thought = {
      title: req.body.title,
      description: req.body.description,
    };

    Thought.update(thought, { where: { id: id } })
      .then(() => {
        req.flash('message', 'Pensamento atualizado com sucesso!');
        req.session.save(() => {
          res.redirect('/thoughts/dashboard');
        });
      })
      .catch((err) => console.log());
  }
}
