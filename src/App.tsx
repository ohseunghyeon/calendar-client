import React from 'react';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Calendar from './components/Calendar';

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path={[
          '/calendar',
          '/calendar/:mode(month|week)',
          '/calendar/:mode(month|week)/:year/:month/:date',
        ]}
        component={Calendar}
      />
      {/* <Route path= component={Calendar} />
      <Route path= component={Calendar} /> */}
      <Redirect from="*" to="/calendar" />;
    </Switch>
  </BrowserRouter>
);

export default App;
