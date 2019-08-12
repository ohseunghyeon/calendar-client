import React from 'react';
import { BrowserRouter, HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import 'moment/locale/ko';
import Calendar from './components/Calendar';

const App: React.FC = () => (
  // <BrowserRouter basename="/calendar-client">
    <HashRouter>
      <Switch>
        <Route
          exact
          path={['/', '/:viewType(month|week)', '/:viewType(month|week)/:year/:month/:date']}
          component={Calendar}
        />
        <Redirect from="*" to="/" />;
    </Switch>
    </HashRouter>
  // </BrowserRouter>
);

export default App;
