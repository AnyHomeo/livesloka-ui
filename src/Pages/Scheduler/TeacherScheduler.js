import React from "react";
import "./teacherscheduler.scss";
const TeacherScheduler = () => {
  return (
    <div className="scheduler-container">
      <div className="days">
        <div className="filler" />
        <div className="filler" />
        <div className="day">Mon</div>
        <div className="day">Tue</div>
        <div className="day">Wed</div>
        <div className="day">Thu</div>
        <div className="day current">Fri</div>
      </div>
      <div className="content">
        <div className="time" style={{ gridRow: 1 }}>
          01:00
        </div>
        <div className="time" style={{ gridRow: 2 }}>
          02:00
        </div>
        <div className="time" style={{ gridRow: 3 }}>
          03:00
        </div>
        <div className="time" style={{ gridRow: 4 }}>
          04:00
        </div>
        <div className="time" style={{ gridRow: 5 }}>
          05:00
        </div>
        <div className="time" style={{ gridRow: 6 }}>
          06:00
        </div>
        <div className="time" style={{ gridRow: 7 }}>
          07:00
        </div>
        <div className="time" style={{ gridRow: 8 }}>
          08:00
        </div>
        <div className="time" style={{ gridRow: 9 }}>
          09:00
        </div>
        <div className="time" style={{ gridRow: 10 }}>
          10:00
        </div>
        <div className="time" style={{ gridRow: 11 }}>
          11:00
        </div>
        <div className="time" style={{ gridRow: 12 }}>
          12:00
        </div>
        <div className="time" style={{ gridRow: 13 }}>
          13:00
        </div>
        <div className="time" style={{ gridRow: 14 }}>
          14:00
        </div>
        <div className="time" style={{ gridRow: 15 }}>
          15:00
        </div>
        <div className="time" style={{ gridRow: 16 }}>
          16:00
        </div>
        <div className="time" style={{ gridRow: 17 }}>
          17:00
        </div>
        <div className="time" style={{ gridRow: 18 }}>
          18:00
        </div>
        <div className="time" style={{ gridRow: 19 }}>
          19:00
        </div>
        <div className="time" style={{ gridRow: 20 }}>
          20:00
        </div>
        <div className="time" style={{ gridRow: 21 }}>
          21:00
        </div>
        <div className="time" style={{ gridRow: 22 }}>
          22:00
        </div>
        <div className="time" style={{ gridRow: 23 }}>
          23:00
        </div>
        <div className="filler-col" />
        <div className="col" style={{ gridColumn: 3 }} />
        <div className="col" style={{ gridColumn: 4 }} />
        <div className="col" style={{ gridColumn: 5 }} />
        <div className="col" style={{ gridColumn: 6 }} />
        <div className="col" style={{ gridColumn: 7 }} />
        <div className="col weekend" style={{ gridColumn: 8 }} />
        <div className="col weekend" style={{ gridColumn: 9 }} />
        <div className="row" style={{ gridRow: 1 }} />
        <div className="row" style={{ gridRow: 2 }} />
        <div className="row" style={{ gridRow: 3 }} />
        <div className="row" style={{ gridRow: 4 }} />
        <div className="row" style={{ gridRow: 5 }} />
        <div className="row" style={{ gridRow: 6 }} />
        <div className="row" style={{ gridRow: 7 }} />
        <div className="row" style={{ gridRow: 8 }} />
        <div className="row" style={{ gridRow: 9 }} />
        <div className="row" style={{ gridRow: 10 }} />
        <div className="row" style={{ gridRow: 11 }} />
        <div className="row" style={{ gridRow: 12 }} />
        <div className="row" style={{ gridRow: 13 }} />
        <div className="row" style={{ gridRow: 14 }} />
        <div className="row" style={{ gridRow: 15 }} />
        <div className="row" style={{ gridRow: 16 }} />
        <div className="row" style={{ gridRow: 17 }} />
        <div className="row" style={{ gridRow: 18 }} />
        <div className="row" style={{ gridRow: 19 }} />
        <div className="row" style={{ gridRow: 20 }} />
        <div className="row" style={{ gridRow: 21 }} />
        <div className="row" style={{ gridRow: 22 }} />
        <div className="row" style={{ gridRow: 23 }} />
      </div>
    </div>
  );
};

export default TeacherScheduler;
