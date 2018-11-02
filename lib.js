const day = d => d.getDate();
const month = d => d.getMonth() + 1;
const year = d => d.getFullYear();
const formattedDate = d => `${year(d)}/${month(d)}/${day(d)}`;

const getDates = () => {
  let date = new Date();
  let dates = [];
  for (let i = 0; i < 3; i++) {
    dates = [...dates, formattedDate(date)];
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

const getTimes = () => {
  /*
  RULES: 
  * You can book a room for the time that's 48 hours ahead of now. 
  * There are timeslots by the interval of 30 mins.
  
  Chi Wah Learning Commons Study Room Level 1 (Seating Capacity 1 - 9)
  Chi Wah Learning Commons Study Room Level 1 (Seating Capacity 10 or more)
  are open 24 hours.
  
  Others:
  Chi Wah Learning Commons Study Room Level 2 (Seating Capacity 1 - 9)
  Chi Wah Learning Commons Study Room Level 2 (Seating Capacity 10 or more)
  from 
  0800 to 2400.
  */
  let date = new Date();
  for (let i = 0; i < 3; i++) {
    let times = [];
  }
};

const getRooms = () => {
  let kinds = {
    firstFloorSmall: {
      title: "Level 1 (Seating Capacity 1 - 9)",
      rooms: [2, 3, 7, 8, 9, 10]
    },
    firstFloorBig: {
      title: "Level 1 (Seating Capacity 10 or more)",
      rooms: [1, 4, 5, 6, 11]
    },
    secondFloorSmall: {
      title: "Level 2 (Seating Capacity 1 - 9)",
      rooms: [18, 19, 20, 21, 23, 24, 25]
    },
    secondFloorBig: {
      title: "Level 2 (Seating Capacity 10 or more)",
      rooms: [12, 13, 14, 15, 16, 17, 22]
    }
  };
  let rooms = [];
  Object.keys(kinds).forEach(key => {
    let eachFloorRooms = kinds[key].rooms.map(
      num => `Room ${num} -- ${kinds[key].title}`
    );
    rooms = [...rooms, ...eachFloorRooms];
  });
  return rooms;
};

exports.getDates = getDates;
exports.getRooms = getRooms;
