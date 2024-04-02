# MMM-MuellBonn

A [MagicMirror](https://github.com/MichMich/MagicMirror) Module to remind on the next date for trash collection.


## Requirements

This module is to be used with the [MagicMirror](https://github.com/MichMich/MagicMirror) project, so it assumes you have a working MagicMirror set up and running already. There is a great community for this project on places like [Reddit](https://www.reddit.com/r/MagicMirror/) and also the [MagicMirror Forums](https://forum.magicmirror.builders/) if you need help with getting started. There is also great [documentation](https://magicmirror.builders/) if you'd like to get started building your own module.

## Installation

1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/heribertmsb/MMM-MuellBonn`
2. Open your config file in `config/config.js` and add the module to the modules array like so:

```
modules: [
    ...Other Modules Here...,
    {
        module: 'MMM-MuellBonn',
        position: 'top_right',
    }
]
```

_Note_: The custom CSS for this module (`style.css`) is located in the `MMM-MUellBonn` folder and is set for a width of `420px`. This value may have to be adjusted for your mirror and preferred location for the module.
