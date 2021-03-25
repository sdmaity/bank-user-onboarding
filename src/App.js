import React from 'react';
import './App.css';


class PersonalInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      errors: [],
      data: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  inputFields = {
    'name': 'Name',
    'ssn': 'SSN',
    'address': 'Address',
    'city': 'City',
    'state': 'State',
    'zip_code': 'Zip Code',
  };

  handleChange(e) {
    this.setState({
      data: Object.assign({}, this.state.data, {[e.target.name]: e.target.value}),
      showError: false
    });
  }
  handleSubmit() {
    let errors = [];
    for (let name in this.inputFields) {
      if (!this.state.data[name]) {
        errors.push('Please fill all the fields');
        break;
      }
    }
    if (this.state.data['ssn'] && (isNaN(this.state.data['ssn']) || this.state.data['ssn'].length !== 9)) {
      errors.push('SSN should be a 9 digit number');
    }
    if (this.state.data['state'] && !(/[a-zA-Z]{2}/.test(this.state.data['state']))) {
      errors.push('State should be a two letter input (alphabets only)');
    }
    if (this.state.data['zip_code'] && (isNaN(this.state.data['zip_code']) || this.state.data['zip_code'].length !== 5)) {
      errors.push('Zip Code should be a 5 digit number');
    }
    if (errors.length) {
      this.setState({
        showError: true,
        errors: errors
      });
    } else {
      this.props.saveData(1, this.state.data);
    }
  }
  render() {
    return (
      <div className="personal-info">
        <div className="show-error">
          <ul>
            {this.state.showError && this.state.errors.map(e => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        {Object.entries(this.inputFields).map(([i_name, label]) => (
          <div key={i_name} className="row">
            <label>{label}</label>
            <input type="text" name={i_name} onChange={this.handleChange}/>
          </div>
        ))}
        <div className="button-wrapper">
          <button onClick={this.handleSubmit}>Next</button>
        </div> 
      </div>
    );
  }
}

class BankOnboarding extends React.Component {
  constructor(props) {
    super(props);
    let allData = localStorage.getItem('allData');
    this.state = {
      formType: 1,
      loading: false,
      allData: allData ? JSON.parse(allData) : {}
    };
    this.saveData = this.saveData.bind(this);
  }
  formDetails = {
    1: {
      header: 'Personal Info'
    },
    2: {
      header: 'Business Info'
    },
    3: {
      header: 'Review Info'
    }
  }

  saveData(formType, data) {
    let allData = {...this.state.allData};
    allData[formType] = data;
    localStorage.setItem('allData', JSON.stringify(allData));
    this.setState({allData: allData});
  }

  render () {
    return (<>
      <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    {this.formDetails[this.state.formType].header}
                    <span className="close_button">x</span>
                </div>
                <div className="modal-body">
                    {this.state.loading && (<div className="loader">Loading...</div>)}
                    <PersonalInfoForm saveData={this.saveData}/>
                    {/* {props.submitButton && (<div className="button_wrapper w100p">
                        {props.submitButton}
                        <button className="rfloat" onClick={props.closeModal}>Close</button>
                        <div style={{clear: 'both'}}></div>
                    </div>)} */}
                </div>
            </div>
        </div>
        <div className="modal-overlay"></div>
    </>)
  }
}

function App() {
  return (
    <div className="App">
      <BankOnboarding />
    </div>
  );
}

export default App;
