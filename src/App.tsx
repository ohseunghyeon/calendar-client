import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import MonthView from './components/MonthView';

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/calendar/month/:year/:month/:date" component={MonthView} />
      <Route exact path="/calendar/week/:year/:month/:date" component={MonthView} />
    </Switch>
    <Route exact path="/" render={redirectToMonth} />
  </BrowserRouter>
);

const redirectToMonth = () => <Redirect to="/calendar/month" />;

export default App;
