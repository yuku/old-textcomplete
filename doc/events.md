Textcomplete provides custom events for most actions. Generally, these come in an infinitive and past participle form - where the infinitive (ex. `show`) is triggered at the start of an event, and its past participle form (ex. `shown`) is triggered on the completion of an action.

An infinitive events provide `preventDefault` functionality. This provides the ability to stop the execution of an action before it starts.

Event Type | Detail                          | Description 
-----------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------
show       | {@link Dropdown#event:show}     | This event is fired immediately when the dropdown is going to be shown.
shown      | {@link Dropdown#event:shown}    | This event is fired when the dropdown has been made visible to the user (will wait for CSS transitions to complete).
render     | {@link Dropdown#event:render}   | This event is fired immediately when dropdown items are goint to be visible to the user.
rendered   | {@link Dropdown#event:rendered} | This event is fired when the dropdown items have been visible to the user (will wait for CSS transitions to complete).
hide       | {@link Dropdown#event:hide}     | This event is fired immediately when the dropdown is going to be hidden.
hidden     | {@link Dropdown#event:hidden}   | This event is fired when the dropdown has finished being hidden from the user (will wait for CSS transitions to complete).
