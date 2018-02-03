import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import FullCalendar from 'fullcalendar-reactwrapper';
import $ from 'jquery';
//import './fullcalendar-css.css';
import fullCalendar from 'fullcalendar';

const formattedSeconds = (sec) =>
  Math.floor(sec / 60) +
    ':' +
  ('0' + sec % 60).slice(-2)

class App extends Component {

  constructor() {
    super();

    var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();


    this.state = {
      date: date,
      showDelModal: false,
      showEditModal: false,
      showExerciseEditModal: false,
      showExerciseDelModal: false,
      showWorkoutsModal: false,
      showExercisesModal: false,
      showIndividualExerciseModal: false,
      showExerciseOptionsModal: false,
      showWorkoutEditModal: false,
      showWorkoutDelModal: false,
      showCalendarModal: false,

      users: [],
      userName: '',
      userTitle: '',
      userId: '',
      events: [],

      userWorkouts: [],
      exerciseName: '',
      workoutTItle: '',
      workoutId: '',
      exerciseTitle: '',
      exerciseId: '',
      sets: 0,
      setsArray: [],
      reps: 0,
      displayReps: '',
      weight: 0,
      setsBtnState: '',
      setsColor: '#4CAF50',
      setsCompleted: 0,
      exercises: [],
      workoutName: '',

      secondsElapsed: 0,
      laps: [],
      lastClearedIncrementer: null,
      totalReps: 0,
    };

    this.incrementer = null;

    this.handleLogExercise = this.handleLogExercise.bind(this);
    this.handleSubtractWeight = this.handleSubtractWeight.bind(this);
    this.handleAddWeight = this.handleAddWeight.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleRepsChange = this.handleRepsChange.bind(this);
    this.handleSetsChange = this.handleSetsChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleExerciseSubmit = this.handleExerciseSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleDelShow = this.handleDelShow.bind(this);

    this.handleDelClose = this.handleDelClose.bind(this);
    this.handleEditShow = this.handleEditShow.bind(this);
    this.handleExerciseEditShow = this.handleExerciseEditShow.bind(this);
    this.handleEditClose = this.handleEditClose.bind(this);
    this.handleWorkoutsClose = this.handleWorkoutsClose.bind(this);

    this.handleWorkoutSubmit = this.handleWorkoutSubmit.bind(this);
    this.handleExercisesClose = this.handleExercisesClose.bind(this);
    this.handleWorkoutEditClose = this.handleWorkoutEditClose.bind(this);
    this.handleWorkoutDelClose = this.handleWorkoutDelClose.bind(this);
    this.handleIndividualExerciseClose = this.handleIndividualExerciseClose.bind(this);
    this.handleExerciseEditClose = this.handleExerciseEditClose.bind(this);
    this.handleExerciseDelClose = this.handleExerciseDelClose.bind(this);
    this.handleExerciseOptionsShow = this.handleExerciseOptionsShow.bind(this);
    this.handleExerciseOptionsClose = this.handleExerciseOptionsClose.bind(this);

    this.handleSetBtn = this.handleSetBtn.bind(this);
    //this.handleCalendarModalShow = this.handleCalendarModalShow.bind(this);
    this.handleCalendarModalClose = this.handleCalendarModalClose.bind(this);
    this.handleCalendarShow = this.handleCalendarShow.bind(this);
    this.showWorkouts = this.showWorkouts.bind(this);
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

  editWorkout(workoutId, workoutTitle) {
    const userRef = firebase.database().ref(`/Users/${this.state.userId}/${workoutId}`);
    userRef.update({
      name: this.state.workoutTitle
    });
  }

  editExercise(exerciseId, exerciseTitle) {
    //alert(exerciseId +':' +this.state.exerciseTitle);
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${exerciseId}`);

    exerciseRef.update({
      name: this.state.exerciseTitle
    });
  }

  deleteExercise(exerciseId, exerciseTitle) {
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${exerciseId}`);
    exerciseRef.remove();
    this.handleExerciseDelClose();
  }

  removeUser(userId, userTitle) {
      const userRef = firebase.database().ref(`/Users/${userId}`);
      userRef.remove();
      //alert(userName + ' has been deleted!');
      this.handleDelClose();
  }

  deleteWorkout(workoutId, workoutTitle) {
    const userRef = firebase.database().ref(`/Users/${this.state.userId}/${workoutId}`);
    userRef.remove();
    //alert(workoutTitle + ' has been deleted!');
    this.handleWorkoutDelClose();
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

  handleWorkoutsClose() {
		this.setState({ showWorkoutsModal: false });
  }

  handleExercisesClose() {
		this.setState({ showExercisesModal: false });
  }

  handleIndividualExerciseClose() {
    this.setState({ showIndividualExerciseModal: false });
    clearInterval(this.incrementer);
  this.setState({
    secondsElapsed: 0,
    laps: []
  });
  }

  handleExerciseEditClose() {
		this.setState({ showExerciseEditModal: false});
  }

  handleExerciseDelClose() {
		this.setState({ showExerciseDelModal: false});
	}

	handleEditShow(userId, userTitle) {
    this.setState({
      userTitle: userTitle,
      userId: userId
    });
		this.setState({ showEditModal: true });
  }

  handleWorkoutEditClose() {
    this.setState({ showWorkoutEditModal: false });
  }

  handleWorkoutEditShow(workoutId, workoutTitle) {
    this.setState({
      workoutTitle: workoutTitle,
      workoutId: workoutId
    });
    this.setState({ showWorkoutEditModal: true});
  }

  handleWorkoutDelShow(workoutId, workoutTitle) {
    this.setState({
      workoutTitle: workoutTitle,
      workoutId: workoutId,
      showWorkoutDelModal: true
    });
  }

  handleWorkoutDelClose() {
    this.setState({
      showWorkoutDelModal: false
    })
  }

  handleExerciseEditShow(exerciseId, exerciseTitle) {
    this.setState({
      exerciseTitle: exerciseTitle,
      exerciseId: exerciseId
    });
    this.setState({ showExerciseEditModal: true});
  }

  handleExerciseDelShow(exerciseId, exerciseTitle) {
    this.setState({
      exerciseId: exerciseId,
      exerciseTitle: exerciseTitle,
      showExerciseDelModal: true
    });
  }

  handleExerciseOptionsShow() {
    this.setState({
      showExerciseOptionsModal: true,
    });
  }

  handleExerciseOptionsClose() {
    this.setState({
      showExerciseOptionsModal: false,
    });
  }

  /*handleEdit(e) {
    var newName = prompt("Update the exercise name", name);
    console.log(key);

    if (key && newName.length > 0) {

        // Build the FireBase endpoint to the exercise
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

  updateWeight() {

  }

  handleWeightChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);

    exerciseRef.update({
      weight: e.target.value,
    });
  }

  handleRepsChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);

    exerciseRef.update({
      reps: e.target.value,
    });
  }

  handleSubtractReps() {
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);
    var newReps = this.state.reps;
    if(this.state.reps > 0) {
      newReps = parseFloat(this.state.reps) - 1;
    } else {
      alert("Can't have negative reps!");
    }
    this.setState({ reps: newReps });

    exerciseRef.update({
      reps: newReps,
    });
  }

  handleAddReps() {
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);

    var newReps = parseFloat(this.state.reps) + 1;

    this.setState({ reps: newReps });

    exerciseRef.update({
      reps: newReps,
    });
  }

  handleSetsChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);

    exerciseRef.update({
      sets: e.target.value,
    });

    let tempSets = [];
    for(var i = 0; i < e.target.value; i++) {
      tempSets.push({
        sets: [i],
      });
    }
    this.setState({ setsArray: tempSets });
  }

  handleSubtractSets(e) {
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);
    var newSets = this.state.sets;
    if(this.state.sets > 0) {
      newSets = parseFloat(this.state.sets) - 1;
      this.setState({ sets: newSets });
      exerciseRef.update({
        sets: newSets,
      });

      let tempSets = [];
      for(var i = 0; i < newSets; i++) {
        tempSets.push({
          sets: [i],
        });
      }
      this.setState({ setsArray: tempSets });
    } else {
      alert("Can't have negative sets!");
    }
  }

  handleAddSets(e) {
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);

    var newSets = parseFloat(this.state.sets) + 1;

    this.setState({ sets: newSets });

    exerciseRef.update({
      sets: newSets,
    });

    let tempSets = [];
    for(var i = 0; i < newSets; i++) {
      tempSets.push({
        sets: [i],
      });
    }
    this.setState({ setsArray: tempSets });
  }

  handleAddWeight() {

    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);
    var newWeight = parseFloat(this.state.weight) + 5;

    this.setState({ weight: newWeight });

    exerciseRef.update({
      weight: newWeight,
    });
  }

  handleSubtractWeight() {
    const exerciseRef = firebase.database().ref(`/Users/${this.state.userId}/${this.state.workoutId}/${this.state.exerciseId}`);

    var newWeight = this.state.weight;
    if(this.state.weight > 0) {
      var newWeight = parseFloat(this.state.weight) - 5;
    } else {
      alert("Can't have negative weight!");
    }


    this.setState({ weight: newWeight });

    exerciseRef.update({
      weight: newWeight,
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

  handleWorkoutSubmit(e) {
    console.log(this.state.userId);
    e.preventDefault();
    const userRef = firebase.database().ref(`Users/${this.state.userId}`);
    const workout = {
      name: this.state.workoutName,
    }
    var newRef = userRef.push(workout).key;
    /* REMOVED THIS TO CHECK IF NOT NEEDED 1/26 userRef.child(newRef).push({
      title: 'Default Item'
    });*/
    this.setState({
      workoutName: ''
    });
  }

  handleExerciseSubmit(e) {
    console.log(this.state.userId);
    e.preventDefault();
    const workoutRef = firebase.database().ref(`Users/${this.state.userId}/${this.state.workoutId}`);
    const exercise = {
      name: this.state.exerciseName,
      sets: 5,
      reps: 0,
      weight: 0,

    }
    workoutRef.push(exercise);

    this.setState({
      exerciseName: ''
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

  showWorkouts(userId, userTitle) {
    const userRef = firebase.database().ref('Users');
    userRef.child(userId).on('value', (snapshot) => {
        let userWorkouts = snapshot.val();
        let userWorkoutState = [];
        for (let userWorkout in userWorkouts) {
          if(typeof(userWorkouts[userWorkout].name) !== 'undefined') {
            userRef.child(userId).child(userWorkout).on('value', (child) => {
              let count = child.numChildren();
              let adjCount = count - 1;
            userWorkoutState.push({
              id: userWorkout,
              name: userWorkouts[userWorkout].name,
              count: adjCount
            });
          });
          }
        }
        const logRef = userRef.child(userId).child('Log');
        logRef.on('value', (snapshot) => {
          let logSnapshot = snapshot.val();
          let logState = [];
          let repsAttempted = 0;
          for(let log in logSnapshot) {
            repsAttempted = parseFloat(logSnapshot[log].setsAttempted) * parseFloat(this.state.reps);
            logState.push({
              start: logSnapshot[log].date,
              end: logSnapshot[log].date,
              eventClasses: 'optionalEvent',
              title: logSnapshot[log].exerciseName,
              description: 'Workout Name: ' + logSnapshot[log].workoutName + '\n'
              + 'Exercise Name: ' + logSnapshot[log].exerciseName + '\n'
              + 'Sets Attempted: ' + logSnapshot[log].setsAttempted + '\n'
              + 'Sets Completed: ' + logSnapshot[log].setsCompleted + '\n'
              + 'Reps Attempted: ' + logSnapshot[log].repsAttempted + '\n'
              + 'Reps Completed: ' + logSnapshot[log].repsCompleted + '\n'
              + 'Weight: ' + logSnapshot[log].weight,
            });
          }
          this.setState({
            events: logState,
          });
        })
        this.setState({
          userWorkouts: userWorkoutState,
        });
    });
    this.setState({
      userTitle: userTitle,
      userId: userId
    });
    this.setState({
      showWorkoutsModal: true
    });
  }

  showExercises(workoutId, workoutTitle) {
    const userRef = firebase.database().ref('Users');
    userRef.child(this.state.userId).child(workoutId).on('value', (snapshot) => {
        let exercises = snapshot.val();
        let childState = [];
        for (let exercise in exercises) {
          if(typeof(exercises[exercise].name) !== 'undefined') {
            childState.push({
              id: exercise,
              name: exercises[exercise].name,
              sets: exercises[exercise].sets,
              reps: exercises[exercise].reps,
              weight: exercises[exercise].weight,
            });
          }
        }
        this.setState({
          exercises: childState
        });
    });
    this.setState({
      workoutTitle: workoutTitle,
      workoutId: workoutId
    });
    this.setState({
      showExercisesModal: true
    });
  }

  showIndividualExercise(exerciseId, exerciseTitle, exerciseSets, exerciseReps, exerciseWeight) {

    let tempSets = [];
    for(var i = 0; i < exerciseSets; i++) {
      tempSets.push({
        sets: [i],
        id: [i],
      });
    }
    this.setState({ setsArray: tempSets });

    this.setState({
      exerciseId: exerciseId,
      exerciseTitle: exerciseTitle,
      sets: exerciseSets,
      reps: exerciseReps,
      weight: exerciseWeight,
      showIndividualExerciseModal: true,
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

  handleSetBtn(e) {
    console.log(e.target.id);
    e.target.style.backgroundColor = '#337ab7';
    var setsCount = this.state.setsCompleted;
    setsCount++;
    //Possibly handle a count for each set pressed for
    //logging exercise completion
    this.setState({
      setsCompleted: setsCount,
    });

    if(this.state.secondsElapsed === 0) {
      this.incrementer = setInterval( () =>
        this.setState({
          secondsElapsed: this.state.secondsElapsed + 1
        })
      , 1000);
    } else {
      clearInterval(this.incrementer);
    this.setState({
      secondsElapsed: 0,
      laps: []
    });

    this.incrementer = setInterval( () =>
      this.setState({
        secondsElapsed: this.state.secondsElapsed + 1
      })
    , 1000);
    }

    var reps = this.state.reps;
    var totalReps = this.state.totalReps;
    var total = reps + totalReps;

    this.setState({
      totalReps: total,
    });

    const userRef = firebase.database().ref(`/Users/${this.state.userId}`).child('Log');

      const name = {
        workoutName: this.state.workoutTitle,
        exerciseName: this.state.exerciseTitle,
        setsAttempted: this.state.sets,
        setsCompleted: this.state.setsCompleted,
        repsPerSetAttempted: this.state.reps,
        repsCompleted: this.state.repsCompleted,
        dateCompleted: this.state.date,
      }
      //userRef.push(name);
    //Stopwatch

    //console.log(this.state.setsCompleted);
  }

  handleLogExercise() {
    const userRef = firebase.database().ref(`/Users/${this.state.userId}`).child('Log');
    var repsAttempted = parseFloat(this.state.sets) * parseFloat(this.state.reps);
      const exerciseInfo = {
        workoutName: this.state.workoutTitle,
        exerciseName: this.state.exerciseTitle,
        setsAttempted: this.state.sets,
        setsCompleted: this.state.setsCompleted,
        repsAttempted: repsAttempted,
        repsCompleted: this.state.totalReps,
        weight: this.state.weight,
        date: this.state.date,
      }
      userRef.push(exerciseInfo);
  }

  handleCalendarShow() {
    const userRef = firebase.database().ref(`/Users/${this.state.userId}`).child('Log');
    userRef.on('value', (snapshot) => {
      let exercises = snapshot.val();
      let childState = [];
      for (let exercise in exercises) {
        if(typeof(exercises[exercise].name) !== 'undefined') {
          console.log(exercises[exercise].date);
          childState.push({
            start: exercises[exercise].date,
            end: exercises[exercise].date,
            eventClasses: 'optionalEvent',
            title: exercises[exercise].exerciseName,
            description: exercises[exercise].workoutName,

            setsAttempted: exercises[exercise].setsAttempted,
            setsCompleted: exercises[exercise].setsCompleted,
            repsCompleted: exercises[exercise].repsCompleted,

          });
        }
      }
      this.setState({
        showCalendarModal: true,
      });
    });











    /*const events = [
    {
        start: '2018-02-01',
        end: '2018-02-04',
        eventClasses: 'optionalEvent',
        title: 'test event',
        description: 'This is a test description of an event',
    },
    {
        start: '2018-02-19',
        end: '2018-02-25',
        title: 'test event',
        description: 'This is a test description of an event',
        data: 'you can add what ever random data you may want to use later',
    },
];

    this.setState({
      events: events,
      showCalendarModal: true,
    });*/
  }

  handleCalendarModalClose() {
    this.setState({ showCalendarModal: false });
  }

  render() {
    return (
      <div id='App' className='container-fluid'>
        <header>
          <div className='wrapper'>
            <h1>Workout</h1>
            <img src="Free Dumbell Icons Vector.png" className="App-logo" alt="logo"/>
            <h1>Portal</h1>
            <hr className="hrFormat"/>
          </div>
          <div ></div>
        </header>
        <form id="createUserDiv" className="jumbotron" onSubmit={this.handleSubmit}>
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
                  <a id="userBtns" onClick={() => this.showWorkouts(user.id, user.name)}>{user.name}<div> {user.count > 0 && <p style={{  color:'red', }}>{user.count} Workout(s)</p>} {user.count == 0 && <p style={{  color:'green',  }}>{user.count} Workout(s)</p>}</div></a><div><button onClick={() => this.handleEditShow(user.id, user.name)} id="editDelBtn" className="btn btn-success btn-sm">Edit Name</button><button onClick={() => this.handleDelShow(user.id, user.name)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button></div>
                </li>
              )
            })}
          </ul>
          </div>
        </section>

        {/*SHOW WORKOUTS MODAL*/}
        <Modal show={this.state.showWorkoutsModal} onHide={this.handleWorkoutsClose} style={{color: "white",}} {...this.props}
        bsSize="large"
        aria-labelledby="contained-modal-title-lg">
          <Modal.Header id="modalHeader" closeButton style={{backgroundColor: "#222", borderBottom: "0", color: "white",}}>
            <Modal.Title id="userModalTitle">{this.state.userTitle}<a onClick={() => this.handleCalendarShow()} style={{ marginLeft: "20px",}}><i className="fas fa-calendar-alt"></i></a></Modal.Title>
          </Modal.Header>
          <Modal.Body id="modalBody" style={{backgroundColor: "#1A0315",}}>
          <form id="createWorkoutDiv" className="jumbotron" onSubmit={this.handleWorkoutSubmit}>
          <h3 className="letterSpacing">Create Workout</h3>
          <input id="createWorkoutText" type="text" name="workoutName" placeholder="Stronglift A" value={this.state.workoutName} onChange={this.handleChange}/>
          <button id="submitBtn" className="btn btn-success btn-sm btn-block">Create</button>
        </form>
          <ol id="workoutList" >
            {this.state.userWorkouts.map((userWorkout) => {
              return (
                <li id="workouts" key={userWorkout.id}>
                  <button id="workoutBtns" onClick={() => this.showExercises(userWorkout.id, userWorkout.name)}>{userWorkout.name}<div> {userWorkout.count > 0 && <p style={{  color:'red' }}>{userWorkout.count} Exercise(s)</p>} {userWorkout.count == 0 && <p style={{  color:'green' }}>{userWorkout.count} Exercise(s)</p>}</div></button><button onClick={() => this.handleWorkoutEditShow(userWorkout.id, userWorkout.name)} id="editDelBtn" className="btn btn-success btn-sm">Edit Name</button><button onClick={() => this.handleWorkoutDelShow(userWorkout.id, userWorkout.name)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
                  {/*<div><p>{exercise.name}<button onClick={() => this.handleExerciseEditShow(exercise.id, exercise.name)} id="editDelBtn" className="btn btn-success btn-sm">Edit</button><button onClick={() => this.handleItemDelShow(exercise.id, exercise.name)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button></p></div>*/}
                </li>
              )
            })}
          </ol>
          </Modal.Body>
          <Modal.Footer id="modalFooter" style={{backgroundColor: "#1A0315", borderTop: "0"}}>
            <Button onClick={this.handleWorkoutsClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/*SHOW EXERCISES MODAL*/}
        <Modal id="modalFormat" show={this.state.showExercisesModal} onHide={this.handleExercisesClose} {...this.props}
        bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header id="modalHeader" closeButton>
            <Modal.Title id="userModalTitle">{this.state.workoutTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body id="modalBody">
          <form id="createWorkoutDiv" className="jumbotron" onSubmit={this.handleExerciseSubmit}>
          <h3 className="letterSpacing">Add Exercise</h3>
          <input id="createWorkoutText" type="text" name="exerciseName" placeholder="New Exercise" value={this.state.exerciseName} onChange={this.handleChange}/>
          <button id="submitBtn" className="btn btn-success btn-sm btn-block">Add</button>
        </form>
          <ol style={{fontSize: "20px", textAlign: "center"}}>
            {this.state.exercises.map((exercise) => {
              return (
                <li id="workouts" key={exercise.id}>
                  <button id="userBtns" onClick={() => this.showIndividualExercise(exercise.id, exercise.name, exercise.sets, exercise.reps, exercise.weight)}>{exercise.name}<div> {exercise.count > 0 && <p style={{  color:'red' }}>{exercise.count} exercise(s)</p>} {exercise.count == 0 && <p style={{  color:'green' }}>{exercise.count} exercise(s)</p>}</div></button><button onClick={() => this.handleExerciseEditShow(exercise.id, exercise.name)} id="editDelBtn" className="btn btn-success btn-sm">Edit Name</button><button onClick={() => this.handleExerciseDelShow(exercise.id, exercise.name)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
                  {/*<div><p>{item.name}<button onClick={() => this.handleItemEditShow(item.id, item.name)} id="editDelBtn" className="btn btn-success btn-sm">Edit</button><button onClick={() => this.handleItemDelShow(item.id, item.name)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button></p></div>*/}
                </li>
              )
            })}
          </ol>
          </Modal.Body>
          <Modal.Footer id="modalFooter">
            {/*<div id="completeDiv"><Button id="completeBtn" onClick={this.handleCompleteWorkout}>Complete Workout</Button></div>
          <br></br>*/}
            <Button onClick={this.handleExercisesClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/*SHOW INDIVIDUAL EXERCISE MODAL*/}
        <Modal id="modalFormat" show={this.state.showIndividualExerciseModal} onHide={this.handleIndividualExerciseClose} {...this.props}
        bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header id="modalHeader" closeButton>
            <Modal.Title id="userModalTitle">{this.state.exerciseTitle}<a onClick={() => this.handleExerciseOptionsShow()} style={{ marginLeft: "20px",}}><i className="fas fa-ellipsis-v"></i></a></Modal.Title>
          </Modal.Header>
          <Modal.Body id="modalBody">
              <div id="weightDiv"><a onClick={() => this.handleSubtractWeight()} style={{marginRight: "10px"}}><i className="fas fa-minus fa-lg"></i></a><label id="weightLabel">Weight:</label><input id="weightInput" type="text" name="weight" placeholder="100" value={this.state.weight} onChange={this.handleWeightChange}></input><a onClick={() => this.handleAddWeight()} style={{marginLeft: "10px"}}><i className="fas fa-plus fa-lg"></i></a></div>
              <br></br>
              {this.state.setsArray.map((sets) => {
                return (
                  <button key={sets.id} id={sets.id} className="setBtns" onClick={this.handleSetBtn} style={{ backgroundColor: this.state.setsColor }}>{this.state.reps}</button>
                )
              })}

              <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(this.state.secondsElapsed)}</h1>
        <div id="logExercise">
          <h2 id="logExerciseHeader">Log Exercise</h2>
          <p>Sets Completed: {this.state.setsCompleted}</p>
          <p>Reps Completed: {this.state.totalReps}</p>
          <p>Weight: {this.state.weight}</p>
        </div>

        <ul className="stopwatch-laps">
          { this.state.laps.map((lap, i) =>
              <li className="stopwatch-lap"><strong>{i + 1}</strong>/ {formattedSeconds(lap)}</li>)
          }
        </ul>
      </div>
          </Modal.Body>
          <Modal.Footer id="modalFooter">
            <div id="completeDiv"><Button id="completeBtn" onClick={this.handleLogExercise}>Log Exercise</Button></div>
            <br></br>
            <Button onClick={this.handleIndividualExerciseClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/*SHOW EXERCISE OPTIONS MODAL*/}
        <Modal id="modalFormat" show={this.state.showExerciseOptionsModal} onHide={this.handleExerciseOptionsClose} {...this.props}
        bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header id="modalHeader" closeButton>
            <Modal.Title id="userModalTitle">{this.state.exerciseTitle} Options</Modal.Title>
          </Modal.Header>
          <Modal.Body id="modalBody">
              <div id="weightDiv"><a onClick={() => this.handleSubtractReps()} style={{marginRight: "10px"}}><i className="fas fa-minus fa-lg"></i></a><label id="weightLabel">Reps:</label><input id="weightInput" type="text" name="reps" placeholder="5" value={this.state.reps} onChange={this.handleRepsChange}></input><a onClick={() => this.handleAddReps()} style={{marginLeft: "10px"}}><i className="fas fa-plus fa-lg"></i></a></div>
              <br></br>
              <div id="weightDiv"><a onClick={() => this.handleSubtractSets()} style={{marginRight: "10px"}}><i className="fas fa-minus fa-lg"></i></a><label id="weightLabel" style={{marginRight: "10px"}}>Sets:</label><input id="weightInput" type="text" name="sets" placeholder="5" value={this.state.sets} onChange={this.handleSetsChange}></input><a onClick={() => this.handleAddSets()} style={{marginLeft: "10px"}}><i className="fas fa-plus fa-lg"></i></a></div>
              <br></br>

          </Modal.Body>
          <Modal.Footer id="modalFooter">
            <Button onClick={this.handleExerciseOptionsClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/*SHOW CALENDAR MODAL*/}
        <Modal id="modalFormat" show={this.state.showCalendarModal} onHide={this.handleCalendarModalClose} {...this.props}
        bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header id="modalHeader" closeButton>
            <Modal.Title id="userModalTitle">Calendar</Modal.Title>
          </Modal.Header>
          <Modal.Body id="modalBody">
            <div><Calendar events={this.state.events}/></div>
            {/*<div>
        <FullCalendar
             id = "your-custom-ID"
	     header = {{
			left: 'prev,next today myCustomButton',
			center: 'title',
			right: 'month,basicWeek,basicDay'
		}}
	     defaultDate={'2017-09-12'}
	    navLinks= {true} // can click day/week names to navigate views
	    editable= {true}
	    eventLimit= {true} // allow "more" link when too many events
	    events = {this.state.events}
	/>
      </div>*/}
          </Modal.Body>
          <Modal.Footer id="modalFooter">
            <Button onClick={this.handleCalendarModalClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/*EDIT EXERCISE MODAL*/}
        <Modal id="modalFormat" show={this.state.showExerciseEditModal} onHide={this.handleExerciseEditClose}>
          <Modal.Header id="modalHeader" closeButton>
            <Modal.Title id="userModalTitle">{this.state.exerciseTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body id="modalBody">
          {/*<form id="addItemDiv" className="jumbotron" onSubmit={this.editItem}>*/}
          <div id="addItemDiv">
          <h3 className="letterSpacing">Edit Exercise Name</h3>
          <input id="createWorkoutText" type="text" name="exerciseTitle" placeholder={this.state.exerciseTitle} value={this.state.exerciseTitle} onChange={this.handleChange}/>
          <button id="submitBtn" onClick={() => this.editExercise(this.state.exerciseId, this.state.exerciseTitle)} className="btn btn-success btn-sm btn-block">Submit</button>
          </div>
        {/*</form>*/}
          {/*<form id="editItemDiv" className="jumbotron" onSubmit={this.editItem}>
            <input id="submitText" type="text" name="itemTitle" placeholder={this.state.itemTitle} value={this.state.itemTitle} onChange={this.handleChange} />
            <button onClick={() => this.editItem(this.state.itemId, this.state.idTitle)} className="btn btn-success btn-sm">Edit</button>
          </form>*/}
          </Modal.Body>
          <Modal.Footer id="modalFooter">
            <Button onClick={this.handleExerciseEditClose}>Close</Button>
          </Modal.Footer>
          </Modal>

          {/*DELETE EXERCISE MODAL*/}
          <Modal id="modalFormat" show={this.state.showExerciseDelModal} onHide={this.handleExerciseDelClose}>
            <Modal.Header id="modalHeader" closeButton>
              <Modal.Title id="userModalTitle">{this.state.exerciseTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="modalBody">
              <h4>Are you sure you would like to delete <strong>{this.state.exerciseTitle}?</strong></h4>
            </Modal.Body>
            <Modal.Footer id="modalFooter">
            <button onClick={() => this.deleteExercise(this.state.exerciseId, this.state.exerciseTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
              <Button onClick={this.handleExerciseDelClose}>Close</Button>
            </Modal.Footer>
          </Modal>

        {/*EDIT WORKOUT MODAL*/}
        <Modal id="modalFormat" show={this.state.showWorkoutEditModal} onHide={this.handleWorkoutEditClose}>
          <Modal.Header id="modalHeader" closeButton>
            <Modal.Title id="userModalTitle">{this.state.workoutTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body id="modalBody">
          <div id="createWorkoutDiv" className="jumbotron" >
            <h3 className="letterSpacing">Edit Workout Name</h3>
            <input id="createWorkoutText" type="text" name="workoutTitle" placeholder={this.state.workoutTitle} value={this.state.workoutTitle} onChange={this.handleChange} />
            <button id="submitBtn" onClick={() => this.editWorkout(this.state.workoutId, this.state.workoutTitle)} className="btn btn-success btn-sm">Submit</button>
          </div>
          </Modal.Body>
          <Modal.Footer id="modalFooter">
            <Button onClick={this.handleWorkoutEditClose}>Close</Button>
          </Modal.Footer>
          </Modal>

          {/*DELETE WORKOUT MODAL*/}
          <Modal id="modalFormat" show={this.state.showWorkoutDelModal} onHide={this.handleWorkoutDelClose}>
            <Modal.Header id="modalHeader" closeButton>
              <Modal.Title id="userModalTitle">{this.state.workoutTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="modalBody">
              <h4>Are you sure you would like to delete <strong>{this.state.workoutTitle}</strong>?</h4>
            </Modal.Body>
            <Modal.Footer id="modalFooter">
            <button onClick={() => this.deleteWorkout(this.state.workoutId, this.state.workoutTitle)} id="editDelBtn" className="btn btn-danger btn-sm">Delete</button>
              <Button onClick={this.handleWorkoutDelClose}>Close</Button>
            </Modal.Footer>
          </Modal>

        {/*EDIT USER MODAL*/}
        <Modal id="modalFormat" show={this.state.showEditModal} onHide={this.handleEditClose}>
          <Modal.Header id="modalHeader" closeButton>
            <Modal.Title id="userModalTitle">{this.state.userTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body id="modalBody">
          <div id="createWorkoutDiv">
          <h3 className="letterSpacing">Edit User Name:</h3>
          {/*<form id="createListDiv" className="jumbotron" onSubmit={this.editItem}>*/}

            <input id="submitText" type="text" name="userTitle" placeholder={this.state.userTitle} value={this.state.userTitle} onChange={this.handleChange} />
            <button id="submitBtn" onClick={() => this.editUser(this.state.userId, this.state.userTitle)} className="btn btn-success btn-sm">Submit</button>
          </div>
          {/*</form>*/}
          </Modal.Body>
          <Modal.Footer id="modalFooter">
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

class Calendar extends React.Component {
  render() {
    return <div id="calendar"></div>;
  }
  componentDidMount() {
    $('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			editable: true,
			droppable: true,
      events: this.props.events,
      displayEventTime: false,

      eventClick: function(calEvent, jsEvent, view) {
        alert(calEvent.description);
        {/*alert('Event: ' + calEvent.title);
        alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
        alert('View: ' + view.name);*/}

        // change the border color just for fun
        $(this).css('border-color', 'red');

    }
    });


  }
}

export default App;
