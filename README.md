# issuu-cli
CLI helper app for working with issuu frontend code


Set `ISSUU_HOME` environment variable (save it in you .bashrc or .zshrc) with path to where you keep your issuu repositories cloned. For example

    export ISSUU_HOME=~/Dev

To install it, clone and run `npm link`. Once it's publish it will be `npm install -g issuu-cli`.

Afterwards, to use it go `issuu [command]`, see `issuu -h` for help.

# `issuu local`

Manage bootstrapping of local packages, i.e. `npm link` on steroids.

- `issuu local` - displays interactive choice of linked packages
- `issuu local [package-name]` - link specific pacakge, package-name can be e.g. `frontend-web` or `payment/widgets`
- `issuu local --save [name]` - save current linking state under an optional name (if not provided, random name is selected)
- `issuu local --load` - displays interactive choice of saved linking states
- `issuu local --load [name]` - load linking state with given name
- `issuu local --list` - list all saved linking states
- `issuu local --reset` - reset linking state, removes all links from fe-webserver
