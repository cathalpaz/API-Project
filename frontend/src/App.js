import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from './components/Home';
import AllGroups from './components/AllGroups';
import AllEvents from './components/AllEvents';
import GroupDetails from './components/GroupDetails';
import CreateGroup from "./components/CreateGroup";
import EditGroup from "./components/EditGroup";
import EventDetails from './components/EventDetails'
import CreateEvent from './components/CreateEvent'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/groups'>
          <AllGroups />
        </Route>
        <Route exact path='/events'>
          <AllEvents />
        </Route>
        <Route exact path='/groups/new'>
          <CreateGroup />
        </Route>
        <Route exact path='/groups/:groupId'>
          <GroupDetails />
        </Route>
        <Route exact path='/groups/:groupId/edit'>
          <EditGroup />
        </Route>
        <Route exact path='/groups/:groupId/newEvent'>
          <CreateEvent />
        </Route>
        <Route exact path='/events/:eventId'>
          <EventDetails />
        </Route>
        <Route>Page Not Found</Route>
        </Switch>}
    </>
  );
}

export default App;
