# VolunteerAdmin

The system will let you organize large numbers of volunteers for configurable tasks.


### Requirement 

#### System parts

##### Volunteer entry and database
- Add volunteer (name, phone number, email, availability, competences, ..more reusable labels)

##### Volunteer search 
- name
- Competence
- Availability
- Experience/preferred

##### Scheduling
- create new task/s
  - reminder
  - reoccurrence
  - Allocation (requested number of persons/resources)
  - individual editing of tasks (even if it is created as a recurrent task)

##### To plan tasks list (List of unplanned tasks)
  - Each tasks are "open" in the task list until it is fully allocated

##### TODO list (list of onetime tasks)
- list of one-time tasks that needs to be handled


##### Admin view
- Task creation
- Scheduling
- Volunteer add/update
 

##### Volunteer/user view (volunteer-form)
- Register as user/volunteer (https://docs.google.com/forms/d/1zLLxrThzt2efFcIZ28Y-ZiSCD8cWO-q3RA5dKldQIII/viewform)
- View users schedule
- Volunteer for recurring task
- Volunteer for single usage task
 

##### Schedule overview
- A view to see who is doing what


##### API:s
- Import users from Excel/csv
- Export to Google calendar events (email & SMS reminders)

### Usage flows

Volunteer registration

1. User registers


Administrator populate event

0. Admin creates the event, and decides when in time it needs to happen.
1. Administrator reviews list of unassigned tasks/events.
2. Admins gets a suggested list of persons for the task/event, that are available for this time slot
3. Admin assigns person to the slot.
4. Admin creates a standby list for the task/event.


#### Resources


#### Info/volunteer administration

Housecare

Interpreters

Transportation (drive and deliver things.)

Food (cooking)

Medical care unit



### TODOS:

* Review Google calender tasks? for the TODO list
* Review https://www.volunteerspot.com/mobile-demo
* Review MyCharityManager.com is a feature-rich free web tool that lets you track volunteers, events, and donations all in one place.
* Review http://www.capterra.com/volunteer-management-software/
* Review http://yourvolunteers.com/


* Review google forms for event posting (https://drive.google.com/previewtemplate?id=0AqIZhq-ehXLFdDNvVmU1Q0x0ZnhMVU9CNnFwaU1qb2c&mode=public)
* Make calender events from forms responses https://developers.google.com/apps-script/quickstart/forms !!!
