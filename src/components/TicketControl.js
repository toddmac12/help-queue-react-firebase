import React from "react";
import NewTicketForm from "./NewTicketForm";
import TicketList from "./TicketList";
import TicketDetail from "./TicketDetail";
import EditTicketForm from "./EditTicketForm";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from './../actions';
import { withFirestore, isLoaded } from 'react-redux-firebase';

class TicketControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timesClicked: 0,
      selectedTicket: null,
      editing: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(), 60000
    );
  }

  componentWillUnmount(){
    
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateTicketElapsedWaitTime = () => {
    const {dispatch} = this.props;
    Object.values(this.props.mainTicketList).forEach(ticket => {
      const newFormattedWaitTime = ticket.timeOpen.fromNow(true);
      const action = a.updateTime(ticket.id, newFormattedWaitTime);
      dispatch(action);
    })
  }

  handleEditingTicketInList = () => {
    this.setState({
      editing: false,
      selectedTicket: null
    });
  }


  handleAddingNewTicketToList = () => {
    const {dispatch} = this.props;
    const action2 = a.toggleForm();
    dispatch(action2);
    this.setState({ timesClicked: 0});
  }

  handleChangingSelectedTicket = (id) => {
    this.props.firestore.get({collection: 'tickets', doc: id}).then((ticket) => {
      const firestoreTicket = {
        names: ticket.get("names"),
        location: ticket.get("location"),
        issue: ticket.get("issue"),
        id: ticket.id
      }
      this.setState({selectedTicket: firestoreTicket });
    });
  }
  

  handleDeletingTicket = (id) => {
    this.props.firestore.delete({collection: 'tickets', doc: id})
    this.setState({selectedTicket: null});
  }

  handleEditClick = () => {
    this.setState({editing: true})
  }

  handleClick = () => {
    if (this.state.selectedTicket != null) {
      this.setState({
        selectedTicket: null,
        editing: false
      });
    } else if (this.props.formVisibleOnPage) {
      this.setState({
        timesClicked: 0,
      });
    } else {
      this.setState({ timesClicked: this.state.timesClicked + 1 });
    }

    if (this.state.timesClicked === 3) {
      const {dispatch} = this.props;
      const action = a.toggleForm();
      dispatch(action);
    }
  };
  render() {
    const auth = this.props.firebase.auth();
    if (!isLoaded(auth)){
      return (
        <React.Fragment>
          <h1> Loading...</h1>
        </React.Fragment>
      );
    }
    if ((isLoaded(auth)) && (auth.currentUser == null)){
      return (
        <React.Fragment>
          <h1> You must be signed in to access the queue.</h1>
        </React.Fragment>
      )
    }
    if ((isLoaded(auth)) && (auth.currentUser != null)){

      let currentlyVisibleState = null;
      let buttonText = null;
      let Message = null;
      if (this.state.editing){
        currentlyVisibleState = <EditTicketForm 
        ticket={this.state.selectedTicket}
        onEditTicket={this.handleEditingTicketInList}
        />
        buttonText = "Return to Ticket List";
      } else if (this.state.selectedTicket != null) {
        currentlyVisibleState = (
          <TicketDetail
          ticket={this.state.selectedTicket}
          onClickingDelete={this.handleDeletingTicket}
          onClickingEdit={this.handleEditClick}
          />
          );
          buttonText = "Return to Ticket List";
        } else if (this.state.timesClicked === 1) {
          Message =
          "Have you gone through all the steps on the Learn How to Program debugging lesson?";
          buttonText = "Really Add Ticket?";
        } else if (this.state.timesClicked === 2) {
          Message = "Have you asked another pair for help?";
          buttonText = " Really Really Add Ticket?";
        } else if (this.state.timesClicked === 3) {
          Message =
          "Have you spent 15 minutes going through through the problem documenting every step?";
          buttonText = "Really, Really, Really Add Ticket?";
        } else if (this.props.formVisibleOnPage && this.state.timesClicked > 3) {
          currentlyVisibleState = (
            <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList} />
            );
            buttonText = "Return to Ticket List";
          } else {
            currentlyVisibleState = (
              <TicketList
              ticketList={this.props.mainTicketList}
              onTicketSelection={this.handleChangingSelectedTicket}
              />
              );
              buttonText = "Add Ticket";
            }
            return (
              <React.Fragment>
        {currentlyVisibleState}
        <p>{Message}</p>
        <button onClick={this.handleClick}>{buttonText}</button>
      </React.Fragment>
    );
  } // sign in
  }
}


TicketControl.propTypes = {
  mainTicketList: PropTypes.object,
  formVisibleOnPage: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    mainTicketList: state.mainTicketList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);

export default withFirestore(TicketControl);