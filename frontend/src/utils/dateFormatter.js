import moment from 'moment';

// Format date for display
export const formatDate = (date) => {
  return moment(date).format('MMMM Do YYYY, h:mm a');
};

// Format date for input fields
export const formatInputDate = (date) => {
  return moment(date).format('YYYY-MM-DDTHH:mm');
};

// Check if event is upcoming
export const isUpcoming = (date) => {
  return moment(date).isAfter(moment());
};

// Sort events by date
export const sortEventsByDate = (events) => {
  return [...events].sort((a, b) => moment(a.date) - moment(b.date));
};