# Set the working dir
DOCKER_WORKSPACE_DIR="$1"

if [ ! $DOCKER_WORKSPACE_DIR ]; then
    APP_WORKING_DIR="$(git rev-parse --show-toplevel)"
else
    APP_WORKING_DIR="$DOCKER_WORKSPACE_DIR"
fi

cp "$APP_WORKING_DIR"/.gitcommands/git/hooks/* "$APP_WORKING_DIR"/.git/hooks/

if command -v git &>/dev/null; then

    echo "Git, installing..."

    # -------------------------------------------------------------
    # Add the git config file to the working dir
    git config --global --unset safe.directory "$APP_WORKING_DIR"
    git config --global --add safe.directory "$APP_WORKING_DIR"
    git config --global --unset-all include.path
    git config --global include.path "$APP_WORKING_DIR"/.gitconfig
    echo 'path set to' && echo "$APP_WORKING_DIR"
    chmod 755 .gitcommands/*

    # -------------------------------------------------------------
    # set the user
    git config --global --replace-all user.email knighttower+git@outlook.com
    git config --global --replace-all user.name Knighttower

    # -------------------------------------------------------------
    # Set symlinks to true
    git config --global --unset core.symlinks
    git config --global core.symlinks false

    # -------------------------------------------------------------
    # Deal with the line endings issue
    git config --global --unset core.autocrlf
    git config --global core.autocrlf input

    # -------------------------------------------------------------
    # Set the default difftool
    git config --global --unset diff.tool
    git config --global diff.tool vscode
    git config --global --unset difftool.vscode
    git config --global --unset difftool.prompt
    git config --global difftool.vscode.cmd "code --wait --diff \$LOCAL \$REMOTE"

    # -------------------------------------------------------------
    # Set the default mergetool
    git config --global --unset merge.tool
    git config --global merge.tool vscode
    git config --global --unset mergetool.vscode
    git config --global --unset mergetool.prompt
    git config --global mergetool.vscode.cmd "code --wait \$MERGED"

    # -------------------------------------------------------------
    # Set the default push behaviour
    # git config --global alias.rmconfigpath "!git init && if git config --global --get include.path >/dev/null; then git config --global --unset-all include.path; fi && echo 'Path has been removed'"
    # git config --global alias.setconfig "!git rmconfigpath && config__path=\"$(git rev-parse --show-toplevel)/.gitconfig\" && git config --global --includes include.path \"$config__path\" && echo \"Path has been set to $config__path\""
    # git config --global alias.setproject "!git setconfig"

    echo -e "\e[32mGit commands have been installed\e[0m"
else
    echo "The 'git' command is not found"
fi
