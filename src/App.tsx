import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import 'moment/locale/ko';
import Calendar from './components/Calendar';

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path={['/calendar', '/calendar/:viewType(month|week)', '/calendar/:viewType(month|week)/:year/:month/:date']}
        component={Calendar}
      />
      <Redirect from="*" to="/calendar" />;
    </Switch>
  </BrowserRouter>
);

export default App;
