import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom'

var isLogged = 0;

const server = 'http://localhost:3001';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={LoginFromWithRouter} />
      <PrivateRoute path="/panel" component={Panel} itemsPerPage="4" />
    </div>
  </Router>
);

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { redirect: false, message: '', };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    //FIXME change to post request

    fetch(server + '/login?' +
      ['username=' + this.username.value, 'password=' + this.password.value].join('&'))
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          isLogged = true;
          this.setState({ redirect: true, message: 'Success!' });
        } else {
          this.setState({
            message: 'Wrong credentials! Check out USERS in src/server/index.js',
          });
        }
      });

    /*
    fetch(server + '/login', {
      method: 'get',
      //headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
      body: JSON.stringify({
       username: this.username.value,
       password: this.password.value,
      }),
    }).catch(error => console.log(error));
    console.log(this.username.value);
    */
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to="/panel" />
      )
    }

    return (
      <div>
        <h1>Login</h1>
        <input type="text" placeholder="username" ref={ input => this.username = input } />
        <input type="password" placeholder="password" ref={ input => this.password = input }/>
        <button onClick={this.handleSubmit}>Log in</button>

        <p>{this.state.message}</p>
      </div>

    )

  }
}

const LoginFromWithRouter = withRouter(LoginForm);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isLogged ? (
      <Panel itemsPerPage={3} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.handleFilter = this.handleFilter.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.state = {
      data: [],
      response: [],
      totalPages: 0,
    };
  }

  componentDidMount() {
    fetch(server + '/api/users')
      .then(res => res.json())
      .then(response => {
        let data = response.slice(0, this.props.itemsPerPage);

        this.setState({
          data: data,
          filterData: false,
          response: response,
          totalPages: Math.ceil(response.length / this.props.itemsPerPage) - 1,
        });
      });
  }

  handleFilter(column, string) {
    var collection = this.state.data.filter(row =>
      // lets make it case insensitive

      row[column].toLowerCase().includes(string.toLowerCase()));

    this.setState({
      filterData: collection,
    });
  }

  onUpdate(id, data) {
    const newResponse = this.state.response.slice();

    // not good in general but works fine in this example
    const row = newResponse[id - 1];

    row.firstName = data.firstName;
    row.lastName = data.lastName;

    this.setState({
      response: newResponse,
    });
  }

  onPageChange(newPage) {
    let index = newPage * this.props.itemsPerPage;
    let data = this.state.response.slice(index, index + this.props.itemsPerPage);

    this.setState({
      data: data,
      filterData: false,
    });
  }

  render() {

    return (
      <div className="Panel">
        <table>
          <thead>
            <tr>
            <td><Filter label="#" column="id" onFilter={this.handleFilter} /></td>
            <td><Filter label="UserName" column="userName" onFilter={this.handleFilter} /></td>
            <td><Filter label="FirstName" column="firstName" onFilter={this.handleFilter} /></td>
            <td><Filter label="LastName" column="lastName" onFilter={this.handleFilter} /></td>
            <td>Actions</td>
            </tr>
          </thead>
          <UserData data={this.state.filterData || this.state.data} onUpdate={this.onUpdate} />
        </table>

        <PageNavigation current={0} total={this.state.totalPages} onChange={this.onPageChange} />
      </div>
    )
  }
}

class PageNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: props.current,
    };

    this.forward = this.forward.bind(this);
    this.backward = this.backward.bind(this);
  }

  shift(step) {
    const newCurrent = this.state.current + step;
    this.props.onChange(newCurrent);
    this.setState({
      current: newCurrent,
    });
  }

  forward() {
    this.shift(1);
  }

  backward() {
    this.shift(-1);
  }

  render() {
    var buttons = [];

    if (this.state.current > 0) {
      buttons.push(
        <button key="0" onClick={this.backward}>Previous</button>
      )
    }
    if (this.state.current < this.props.total) {
      buttons.push(
        <button key="1" onClick={this.forward}>Next</button>
      )
    }
    return (
      <div>
      {buttons}
      </div>

    )

  }
}


class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.handleFilter = this.handleFilter.bind(this);
  }

  handleFilter(e) {
    this.props.onFilter(this.props.column, e.target.value);
  }

  render() {
    return (
      <div>
        <input type="text" placeholder={`filter by ${this.props.label}`} onChange={this.handleFilter} />
      </div>
    )
  }
}


class UserData extends React.Component {
  render() {

    let rows = this.props.data.reduce((acc, row, key) =>
        acc.concat(<RowUserData key={key} data={row} onUpdate={this.props.onUpdate} />), []);

    return (
      <tbody>

      {rows}

      </tbody>
    )
  }
}

class RowUserData extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      editing: false,
      lastName: props.data.lastName,
      firstName: props.data.firstName,
    };

    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.edit = this.edit.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
  }

  save() {
    this.setState({
      editing: false,
    });

    this.props.onUpdate(this.props.data.id, {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    });

    // update the record
    // send it to the server
    // won't do this right now
    // fetch(....)
  }

  handleFirstName(e) {
    this.setState({
      firstName: e.target.value,
    });
  }

  handleLastName(e) {
    this.setState({
      lastName: e.target.value,
    });
  }

  edit() {
    this.setState({
      editing: true,
    });
  }

  cancel() {
    this.setState({
      editing: false,
      lastName: this.props.data.lastName,
      firstName: this.props.data.firstName,
    });
  }

  render() {
    return (

        this.state.editing ?

             <tr>
               <td>{this.props.data.id}</td>
               <td>{this.props.data.userName}</td>
               <td><input type="text" value={this.state.firstName} onChange={this.handleFirstName} /></td>
               <td><input type="text" value={this.state.lastName} onChange={this.handleLastName} /></td>
               <td>
               <button onClick={this.save}>Save</button>
               <button onClick={this.cancel}>Cancel</button>
               </td>
             </tr>

         :
             <tr>
               <td>{this.props.data.id}</td>
               <td>{this.props.data.userName}</td>
               <td>{this.props.data.firstName}</td>
               <td>{this.props.data.lastName}</td>
               <td>
               <button onClick={this.edit}>Edit</button>
               </td>
             </tr>


    )
  }

}

export default App;
