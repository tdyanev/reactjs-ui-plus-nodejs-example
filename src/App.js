import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

var isLogged = false;

const App = () => (
  <Router>
    <div>
      <LoginFromWithRouter redirect="/panel" />
      <PrivateRoute path="/panel" component={Panel}/>
    </div>
  </Router>
)

const server = 'http://localhost:3001';

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { redirect: false };
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
          this.setState({ redirect: true });
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
        <Redirect to={this.props.redirect} />
      )
    }

    return (
      <div>
        <h1>Login</h1>
        <input type="text" placeholder="username" ref={ input => this.username = input } />
        <input type="password" ref={ input => this.password = input }/>
        <button onClick={this.handleSubmit}>Log in</button>
      </div>

    )

  }
}

const LoginFromWithRouter = withRouter(LoginForm);

/*
const LoginForm = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
  )
))
*/

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const Public = () => <h3>Public</h3>
const Panel = () => <h3>Panel</h3>

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

export default App;
