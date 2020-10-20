import * as React from "react";
import {
  ScheduleComponent,
  ResourcesDirective,
  ResourceDirective,
  ViewsDirective,
  ViewDirective,
  Inject,
  TimelineViews,
  Resize,
  DragAndDrop,
  TimelineMonth,
  Day,
} from "@syncfusion/ej2-react-schedule";

import { extend, createElement } from "@syncfusion/ej2-base";
import { SampleBase } from "./sample-base";
import * as dataSource from "./datasource.json";
import Adminsidebar from "../../Adminsidebar";

import { Button } from "@syncfusion/ej2-buttons";

import "./index.css";

/**
 * schedule block events sample
 */
export class Scheduler extends SampleBase {
  constructor() {
    super(...arguments);
    this.data = extend([], dataSource.scheduleData, null, true);
    this.employeeData = [
      {
        Text: "Alice",
        Id: 1,
        GroupId: 1,
        Color: "#bbdc00",
        Designation: "Content writer",
        image:
          "https://avatars0.githubusercontent.com/u/24625310?s=460&u=a7b9ed3c11c7c7a56502fbb7b9d0498a2d2c17cb&v=4",
      },
      {
        Text: "Nancy",
        Id: 2,
        GroupId: 2,
        Color: "#9e5fff",
        Designation: "Designer",
        image:
          "https://avatars0.githubusercontent.com/u/24625310?s=460&u=a7b9ed3c11c7c7a56502fbb7b9d0498a2d2c17cb&v=4",
      },
      {
        Text: "Robert",
        Id: 3,
        GroupId: 1,
        Color: "#bbdc00",
        Designation: "Software Engineer",
        image:
          "https://avatars0.githubusercontent.com/u/24625310?s=460&u=a7b9ed3c11c7c7a56502fbb7b9d0498a2d2c17cb&v=4",
      },
      {
        Text: "Robson",
        Id: 4,
        GroupId: 2,
        Color: "#9e5fff",
        Designation: "Support Engineer",
        image:
          "https://avatars0.githubusercontent.com/u/24625310?s=460&u=a7b9ed3c11c7c7a56502fbb7b9d0498a2d2c17cb&v=4",
      },
      {
        Text: "Laura",
        Id: 5,
        GroupId: 1,
        Color: "#bbdc00",
        Designation: "Human Resource",
        image:
          "https://avatars0.githubusercontent.com/u/24625310?s=460&u=a7b9ed3c11c7c7a56502fbb7b9d0498a2d2c17cb&v=4",
      },
      {
        Text: "Margaret",
        Id: 6,
        GroupId: 2,
        Color: "#9e5fff",
        Designation: "Content Analyst",
        image:
          "https://avatars0.githubusercontent.com/u/24625310?s=460&u=a7b9ed3c11c7c7a56502fbb7b9d0498a2d2c17cb&v=4",
      },

      {
        Text: "Kamal",
        Id: 7,
        GroupId: 2,
        Color: "#9e5fff",
        Designation: "Web Analyst",
        image:
          "https://www.clker.com/cliparts/g/l/R/7/h/u/teamstijl-person-icon-blue-hi.png",
      },
    ];
  }
  getEmployeeName(value) {
    return value.resourceData[value.resource.textField];
  }
  getEmployeeImage(value) {
    return value.resourceData.image;
  }
  getEmployeeDesignation(value) {
    return value.resourceData.Designation;
  }
  resourceHeaderTemplate(props) {
    return (
      <div className="template-wrap">
        <div className="employee-category">
          <div className={"employee-image"}>
            <img className="customimg" src={this.getEmployeeImage(props)} />
          </div>
          <div className="employee-name">{this.getEmployeeName(props)}</div>
          <div className="employee-designation">
            {this.getEmployeeDesignation(props)}
          </div>
        </div>
      </div>
    );
  }

  onPopupOpen(args) {
    if (args.type === "Editor") {
      let dialogObj = args.element.ej2_instances[0];
      let buttons;
      if (args.target.classList.contains("e-appointment")) {
        this.currentEvent = this.scheduleObj.getEventDetails(args.target);
        buttons = [
          {
            buttonModel: { content: "SAVE", isPrimary: true },
            click: this.editEvent.bind(this),
            // click: console.log("Clicked"),
          },
          {
            buttonModel: { content: "DELETE" },
            click: this.eventDelete.bind(this),
            // click: console.log("Clicked"),
          },
          // {
          //   buttonModel: { content: "CANCEL", cssClass: "e-event-cancel" },
          //   // click: this.dialogClose.bind(this),
          //   click: console.log("Clicked"),
          // },
        ];
      } else {
        buttons = [
          {
            buttonModel: { content: "SAVE", isPrimary: true },
            click: this.eventAdd.bind(this),
            // click: console.log("Clicked"),
          },
          // {
          //   buttonModel: { content: "CANCEL", cssClass: "e-event-cancel" },
          //   // click: this.dialogClose.bind(this),
          //   click: console.log("Clicked"),
          // },
        ];
      }
      dialogObj.buttons = buttons;
      dialogObj.dataBind();
    }
  }

  editEvent(args) {
    // console.log(e);
    console.log("Edited");
  }
  eventDelete() {
    console.log("clicked");
  }
  eventAdd(props) {
    console.log(props);
    console.log("Saved");
  }
  render() {
    return (
      <>
        <Adminsidebar />
        <div className="schedule-control-section">
          <div className="col-lg-12 control-section">
            <div className="control-wrapper drag-sample-wrapper">
              <div className="schedule-container customstyle">
                <ScheduleComponent
                  ref={(schedule) => (this.scheduleObj = schedule)}
                  cssClass="block-events"
                  width="99%"
                  height="650px"
                  selectedDate={new Date()}
                  currentView="Day"
                  resourceHeaderTemplate={this.resourceHeaderTemplate.bind(
                    this
                  )}
                  eventSettings={{
                    dataSource: this.data,
                  }}
                  group={{ enableCompactView: false, resources: ["Employee"] }}
                  popupOpen={this.onPopupOpen.bind(this)}
                >
                  <ResourcesDirective>
                    <ResourceDirective
                      field="EmployeeId"
                      title="Agents"
                      name="Employee"
                      allowMultiple={true}
                      dataSource={this.employeeData}
                      textField="Text"
                      idField="Id"
                      colorField="Color"
                    ></ResourceDirective>
                  </ResourcesDirective>
                  <ViewsDirective>
                    <ViewDirective option="Day" />
                    <ViewDirective option="TimelineDay" />
                    <ViewDirective option="TimelineMonth" />
                  </ViewsDirective>
                  <Inject
                    services={[
                      Day,
                      TimelineViews,
                      TimelineMonth,
                      Resize,
                      DragAndDrop,
                    ]}
                  />
                </ScheduleComponent>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Scheduler;
