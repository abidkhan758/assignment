import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addGroup, deleteGroup, updateGroupRange, fetchTodoStatuses } from './todoSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.todos.groups);

  const handleAddGroup = () => {
    dispatch(addGroup());
  };

  const handleDeleteGroup = (index) => {
    dispatch(deleteGroup(index));
  };

  const handleChangeRange = (index, field, value) => {
    dispatch(updateGroupRange({ index, field, value }));
  };

  const handleFetchStatuses = () => {
    dispatch(fetchTodoStatuses());
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Todo Groups Manager</h1>
      {groups.map((group, index) => (
        <div key={index} className="card mb-3">
          <div className="card-body classBG">
            <div className="form-row align-items-center">
              <div className="col">
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="From"
                  value={group.from}
                  onChange={(e) => handleChangeRange(index, 'from', e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="To"
                  value={group.to}
                  onChange={(e) => handleChangeRange(index, 'to', e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-danger " onClick={() => handleDeleteGroup(index)}>
                  Delete
                </button>
              </div>
              <div className="col-12 mt-3 color">
                {group.status.length > 0 && group.status.map((item, idx) => (
                  <span key={idx} className="badge badge-secondary mr-2 useColor">
                    Item {item.id} Completed: {item.completed ? "true" : "false"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-primary marginRight" onClick={handleAddGroup}>
        Add Group
      </button>
      <button className="btn btn-success " onClick={handleFetchStatuses}>
        Show Status
      </button>
    </div>
  );
}

export default App;
