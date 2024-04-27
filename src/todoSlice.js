import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  groups: [{ from: 1, to: 10, status: [] }],
};

export const fetchTodoStatuses = createAsyncThunk(
  'todos/fetchStatuses',
  async (_, { getState }) => {
    const { groups } = getState().todos;
    const statusResults = await Promise.all(
      groups.map(group =>
        Promise.all(
          Array.from({ length: group.to - group.from + 1 }, (_, i) => i + group.from)
            .map(todoId =>
              fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`)
                .then(response => response.json())
                .then(data => ({ id: todoId, completed: data.completed }))
            )
        )
      )
    );
    return statusResults;
  }
);

// Helper function to check overlap
function isOverlapping(newGroup, groups, currentIndex) {
  for (let i = 0; i < groups.length; i++) {
    if (i !== currentIndex) {  // Ignore the current group being edited
      const group = groups[i];
      if (newGroup.from <= group.to && newGroup.to >= group.from) {
        return true; // Overlap detected
      }
    }
  }
  return false;
}

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addGroup(state) {
      const newGroup = { from: '', to: '', status: [] };
      state.groups.push(newGroup);  // Add a new group without initial range
    },
    deleteGroup(state, action) {
      state.groups.splice(action.payload, 1);
    },
    updateGroupRange(state, action) {
      const { index, field, value } = action.payload;
      const newGroups = [...state.groups];
      newGroups[index][field] = parseInt(value, 10);

      if (newGroups[index].from < 1 || newGroups[index].to > 10 || isNaN(newGroups[index].from) || isNaN(newGroups[index].to)) {
        alert("Group range must be within 1 to 10.");
        return;
      }

      if (isOverlapping(newGroups[index], newGroups, index)) {
        alert("Group range overlaps with another group.");
      } else {
        state.groups = newGroups; // Update only if there's no overlap
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodoStatuses.fulfilled, (state, action) => {
      action.payload.forEach((groupStatuses, index) => {
        state.groups[index].status = groupStatuses;
      });
    });
  }
});

export const { addGroup, deleteGroup, updateGroupRange } = todoSlice.actions;
export default todoSlice.reducer;
