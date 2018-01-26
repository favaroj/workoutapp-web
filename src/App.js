import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class App extends Component {

  constructor() {
    super();
    this.state = {
      showDelModal: false,
      showEditModal: false,
      showItemEditModal: false,
      showItemDelModal: false,
      showListModal: false,
      showSubListModal: false,
      showSubListEditModal: false,
      showSubListDelModal: false,

      users: [],
      userName: '',
      userTitle: '',
      userId: '',

      subLists: [],
      subListName: '',
      subListTItle: '',
      subListId: '',

      items: [],
      itemName: '',
      itemId: '',
      itemTitle: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemSubmit = this.handleItemSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleDelShow = this.handleDelShow.bind(this);

    this.handleDelClose = this.handleDelClose.bind(this);
    this.handleEditShow = this.handleEditShow.bind(this);
    this.handleItemEditShow = this.handleItemEditShow.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.handleListClose = this.handleListClose.bind(this);

    this.handleSubListSubmit = this.handleSubListSubmit.bind(this);
    this.handleSubListClose = this.handleSubListClose.bind(this);
    this.handleSubListEditClose = this.handleSubListEditClose.bind(this);
    this.handleSubListDelClose = this.handleSubListDelClose.bind(this);
    this.handleItemEditClose = this.handleItemEditClose.bind(this);
    this.handleItemDelClose = this.handleItemDelClose.bind(this);
  }

  editUser(userId, userTitle) {
      const userRef = firebase.database().ref(`/Users/${userId}`);
      const name = {
        name: this.state.userTitle,
      }
      userRef.update({
        name: userTitle
      });
      //alert(userName + ' has been edited!');
      //this.handleEditClose();
  }

  editSubList(itemId, subListTitle) {
    const userRef = firebase.database().ref(`/Users/${this.state.userId}/${itemId}`);
    userRef.update({
      title: this.state.subListTitle
    });
  }

  editItem(itemId, itemTitle) {
    //alert(itemId +':' +this.state.itemTitle);
    const userRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.subListId}/${itemId}`);

    userRef.update({
      title: this.state.itemTitle
    });
  }

  deleteItem(itemId, itemTitle) {
    const userRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.subListId}/${itemId}`);
    userRef.remove();
    this.handleItemDelClose();
  }

  removeUser(userId, userTitle) {
      const userRef = firebase.database().ref(`/Users/${userId}`);
      userRef.remove();
      //alert(userName + ' has been deleted!');
      this.handleDelClose();
  }

  removeSubList(subListId, subListTitle) {
    const userRef = firebase.database().ref(`/Users/${this.state.userId}/${subListId}`);
    userRef.remove();
    //alert(subListTitle + ' has been deleted!');
    this.handleSubListDelClose();
}

  handleDelClose() {
		this.setState({ showDelModal: false });
	}

	handleDelShow(userId, userTitle) {
    this.setState({
      userTitle: userTitle,
      userId: userId
    });
		this.setState({ showDelModal: true });
  }

  handleEditClose() {
		this.setState({ showEditModal: false });
  }

  handleListClose() {
		this.setState({ showListModal: false });
  }

  handleSubListClose() {
		this.setState({ showSubListModal: false });
  }

  handleItemEditClose() {
		this.setState({ showItemEditModal: false});
  }

  handleItemDelClose() {
		this.setState({ showItemDelModal: false});
	}

	handleEditShow(userId, userTitle) {
    this.setState({
      userTitle: userTitle,
      userId: userId
    });
		this.setState({ showEditModal: true });
  }

  handleSubListEditClose() {
    this.setState({ showSubListEditModal: false });
  }

  handleSubListEditShow(subListId, subListTitle) {
    this.setState({
      subListTitle: subListTitle,
      subListId: subListId
    });
    this.setState({ showSubListEditModal: true});
  }

  handleSubListDelShow(subListId, subListTitle) {
    this.setState({
      subListTitle: subListTitle,
      subListId: subListId,
      showSubListDelModal: true
    });
  }

  handleSubListDelClose() {
    this.setState({
      showSubListDelModal: false
    })
  }

  handleItemEditShow(itemId, itemTitle) {
    this.setState({
      itemTitle: itemTitle,
      itemId: itemId
    });
    this.setState({ showItemEditModal: true});
  }

  handleItemDelShow(itemId, itemTitle) {
    this.setState({
      itemId: itemId,
      itemTitle: itemTitle,
      showItemDelModal: true
    });
  }

  /*handleEdit(e) {
    var newName = prompt("Update the item name", name);
    console.log(key);

    if (key && newName.length > 0) {

        // Build the FireBase endpoint to the item
        var updateRef = buildEndPoint(key);
        updateRef.update({
            title: newName
        });
    }
  }*/

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('Users');
    // Get a key for a new List.
    //THIS MAY BE NEEDED var newListKey = itemsRef.push().key;
    const user = {
      name: this.state.userName,
    }
    itemsRef.push(user).key;
    this.setState({
      userName: ''
    });
  }

  handleSubListSubmit(e) {
    console.log(this.state.userId);
    e.preventDefault();
    const itemsRef = firebase.database().ref(`Users/${this.state.userId}`);
    const item = {
      title: this.state.itemName,
    }
    var newRef = itemsRef.push(item).key;
    itemsRef.child(newRef).push({
      title: 'Default Item'
    });
    this.setState({
      itemName: ''
    });
  }

  handleItemSubmit(e) {
    console.log(this.state.userId);
    e.preventDefault();
    const itemsRef = firebase.database().ref(`Users/${this.state.userId}/${this.state.subListId}`);
    const item = {
      title: this.state.itemName,
    }
    itemsRef.push(item);

    this.setState({
      itemName: ''
    });
  }

  handleEditSubmit(e) {
    //e.preventDefault();
    const userRef = firebase.database().ref(`/Users/${this.state.userId}`);
      const name = {
        name: this.state.userTitle,
      }
      userRef.update({
        name: name
      });
      //alert(this.state.userName + ' has been edited!');
      this.handleEditClose();
    this.setState({
      userTitle: ''
    });
  }

  showList(userId, userTitle) {
    const userRef = firebase.database().ref('Users');
    userRef.child(userId).on('value', (snapshot) => {
        let subLists = snapshot.val();
        let subListState = [];
        for (let subList in subLists) {
          if(typeof(subLists[subList].name) !== 'undefined') {
            userRef.child(userId).child(subList).on('value', (child) => {
              let count = child.numChildren();
              let adjCount = count - 1;
            subListState.push({
              id: subList,
              title: subLists[subList].name,
              count: adjCount
            });
          });
          }
        }
        this.setState({
          subLists: subListState
        });
    });
    this.setState({
      userTitle: userTitle,
      userId: userId
    });
    this.setState({
      showListModal: true
    });
  }

  showItems(subListId, subListTitle) {
    const userRef = firebase.database().ref('Users');
    userRef.child(this.state.userId).child(subListId).on('value', (snapshot) => {
        let items = snapshot.val();
        let childState = [];
        for (let item in items) {
          if(typeof(items[item].name) !== 'undefined') {
            childState.push({
              id: item,
              title: items[item].name
            });
          }
        }
        this.setState({
          items: childState
        });
    });
    this.setState({
      subListTitle: subListTitle,
      subListId: subListId
    });
    this.setState({
      showSubListModal: true
    });
  }

  componentDidMount() {
    const userRef = firebase.database().ref('Users');
    userRef.on('value', (snapshot) => {
      let users = snapshot.val();
      let newState = [];
      let childState = [];
      for (let user in users) {
        if(typeof(users[user].name) !== 'undefined') {
          userRef.child(user).on('value', (child) => {
            let count = child.numChildren();
            let adjCount = count - 1;
            newState.push({
              id: user,
              name: users[user].name,
              count: adjCount
            });
          })
        }
      }
      this.setState({
        users: newState
      });
    });
  }

  render() {
    return (
      <div id='App' className='container-fluid'>
        <header>
          <div className='wrapper'>
            <img src="Free Dumbell Icons Vector.png" className="App-logo" alt="logo"/>
            <h1>Workout Portal<hr className="hrFormat"/></h1>
          </div>
        </header>
        <form id="createListDiv" className="jumbotron" onSubmit={this.handleSubmit}>
          <h3 className="letterSpacing">Create User</h3>
          <input id="submitText" type="text" name="userName" placeholder="New User" value={this.state.userName} onChange={this.handleChange}/>
          <button id="submitBtn" className="btn btn-success btn-lg btn-block">Create</button>
        </form>
        <hr className="hrFormat" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '30px'}}/>
        <section className="jumbotron" id="mainListSection">
          <div className="wrapper">

          <h2 className="letterSpacing">Current Users</h2>
          <hr className="hrFormat" style={{borderColor: '#343a40', marginLeft: '10px', marginRight: '10px'}}/>
          <ul id="mainList">
            {this.state.users.map((user) => {
              return (
                <li className="userContainer" key={user.id}>
                  <a id="userBtns" onClick={() => this.showList(user.id, user.name)}>{user.name}<div> {user.count > 0 && <p style={{  color:'red', margin: '0px 0px 0px 20px' }}>{user.count} Workout(s)</p>} {user.count == 0 && <p style={{  color:'green', margin: '0px 0px 0px 20px' }}>{user.count} Workout(s)</p>}</div></a><button onClick={() => this.handleEditShow(user.id, user.name)} id="editDelBtn" className="btn btn-success btn-sm">Edit Name</button><button onClick={() => this.handleDelShow(user.id, user.name)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
                </li>
              )
            })}
          </ul>
          </div>
        </section>

        {/*SHOW LIST MODAL*/}
        <Modal show={this.state.showListModal} onHide={this.handleListClose}>
          <Modal.Header closeButton>
            <Modal.Title id="userModalTitle">{this.state.userTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form id="addItemDiv" className="jumbotron" onSubmit={this.handleSubListSubmit}>
          <h3 className="letterSpacing">Add List</h3>
          <input id="addItemText" type="text" name="itemName" placeholder="New Item" value={this.state.itemName} onChange={this.handleChange}/>
          <button id="submitBtn" className="btn btn-success btn-sm btn-block">Add</button>
        </form>
          <ol style={{fontSize: "20px", textAlign: "center"}}>
            {this.state.subLists.map((subList) => {
              return (
                <li id="items" key={subList.id}>
                  <button id="userBtns" onClick={() => this.showItems(subList.id, subList.name)}>{subList.name}<div> {subList.count > 0 && <p style={{  color:'red' }}>{subList.count} Item(s)</p>} {subList.count == 0 && <p style={{  color:'green' }}>{subList.count} Item(s)</p>}</div></button><button onClick={() => this.handleSubListEditShow(subList.id, subList.name)} id="editDelBtn" className="btn btn-success btn-sm">Edit Name</button><button onClick={() => this.handleSubListDelShow(subList.id, subList.name)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
                  {/*<div><p>{item.name}<button onClick={() => this.handleItemEditShow(item.id, item.name)} id="editDelBtn" className="btn btn-success btn-sm">Edit</button><button onClick={() => this.handleItemDelShow(item.id, item.name)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button></p></div>*/}
                </li>
              )
            })}
          </ol>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleListClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/*EDIT USER MODAL*/}
        <Modal show={this.state.showEditModal} onHide={this.handleEditClose}>
          <Modal.Header closeButton>
            <Modal.Title id="userModalTitle">{this.state.userTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div id="addItemDiv">
          <h3 className="letterSpacing">Edit The List Name:</h3>
          {/*<form id="createListDiv" className="jumbotron" onSubmit={this.editItem}>*/}

            <input id="submitText" type="text" name="userTitle" placeholder={this.state.userTitle} value={this.state.userTitle} onChange={this.handleChange} />
            <button id="submitBtn" onClick={() => this.editUser(this.state.userId, this.state.userTitle)} className="btn btn-success btn-sm">Submit</button>
          </div>
          {/*</form>*/}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleEditClose}>Close</Button>
          </Modal.Footer>
          </Modal>

          {/*DELETE LIST MODAL*/}
          <Modal show={this.state.showDelModal} onHide={this.handleDelClose}>
            <Modal.Header closeButton>
              <Modal.Title id="userModalTitle">{this.state.userTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Are you sure you would like to delete <strong>{this.state.userTitle}</strong>?</h4>
            </Modal.Body>
            <Modal.Footer>
            <button onClick={() => this.removeUser(this.state.userId, this.state.userTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
              <Button onClick={this.handleDelClose}>Close</Button>
            </Modal.Footer>
          </Modal>
      </div>
    );
  }
}

export default App;
