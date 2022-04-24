const { User } = require('../models');

const userController = {
  // get all user
  // GET /api/users
  getAllUsers(req, res) {
    User.find({})
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get user by id
  // GET /api/users/:id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // ---------------------------------------------------------------------------- CREATE A USER ( POST /api/users ) ------------------------------------------------------------------------------------
    // expected body:
    // {
    //     "username": "name",
    //     "email": "email@email.com"  // must follow the email format
    // }

  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
},

  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

    // ----------------------------------------------------------------------- DELETE A USER ( POST /api/users ) ------------------------------------------------------------------------------------
  
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

// --------------------------------------------------------------------------------- ADD A FRIEND ---------------------------------------------------------------------------------

// POST /api/users/:userId/friends/:friendId
addFriend({ params }, res) {
  // add friendId to userId's friend list
  User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
  )
  .then(dbUserData => {
      if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this userId' });
          return;
      }
      // add userId to friendId's friend list
      User.findOneAndUpdate(
          { _id: params.friendId },
          { $addToSet: { friends: params.userId } },
          { new: true, runValidators: true }
      )
      .then(dbUserData2 => {
          if(!dbUserData2) {
              res.status(404).json({ message: 'No user found with this friendId' })
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => res.json(err));
  })
  .catch(err => res.json(err));
},

// ---------------------------------------------------------------------------------DELETE A FRIEND ---------------------------------------------------------------------------------
// DELETE /api/users/:userId/friends/:friendId
deleteFriend({ params }, res) {
  // remove friendId from userId's friend list
  User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
  )
  .then(dbUserData => {
      if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this userId' });
          return;
      }
      // remove userId from friendId's friend list
      User.findOneAndUpdate(
          { _id: params.friendId },
          { $pull: { friends: params.userId } },
          { new: true, runValidators: true }
      )
      .then(dbUserData2 => {
          if(!dbUserData2) {
              res.status(404).json({ message: 'No user found with this friendId' })
              return;
          }
          res.json({message: 'Successfully deleted the friend'});
      })
      .catch(err => res.json(err));
  })
  .catch(err => res.json(err));
}
}


module.exports = userController;
