# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup and Configuration

### buy domain and add it to route 53

on the roadmap to automate this w/ https://registry.terraform.io/providers/namecheap/namecheap/latest/docs

### gitlab pages and route 53 

requires manual config 

https://docs.gitlab.com/ee/user/project/pages/custom_domains_ssl_tls_certification/

 - Setting > Pages and select + New domain
-  [get the verification code](https://docs.gitlab.com/ee/user/project/pages/custom_domains_ssl_tls_certification/#2-get-the-verification-code)
- set `TF_VAR_gitlab_pages_verification_code` and `TF_VAR_domain` in Settings > CI/CD > Variables 

create an iam user for terraform:

```hcl
resource "aws_iam_user" "{{ cookiecutter.project_name }}" {
  name = "{{ cookiecutter.project_name }}"

  tags = {
    Project  = "{{ cookiecutter.project_name }}"
    Type  = "terraform"
  }
}

data "template_file" "{{ cookiecutter.project_name }}" {
  template = file("./policies/{{ cookiecutter.project_name }}.json")
} 
resource "aws_iam_user_policy" "{{ cookiecutter.project_name }}" {
  name = "{{ cookiecutter.project_name }}"
  user = aws_iam_user.{{ cookiecutter.project_name }}.name

  policy = data.template_file.{{ cookiecutter.project_name }}.rendered
}

```

configure {{ cookiecutter.gitlab_url }}/{{ cookiecutter.gitlab_account }}/{{ cookiecutter.project_name }}/-/settings/ci_cd
for with access key terraform user 

create access key https://console.aws.amazon.com/iam/home#/users/{{ cookiecutter.project_name }}?section=security_credentials

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

push this repo to the new project on gitlab 

```shell
git init --initial-branch=main
git remote add origin git@{{ cookiecutter.gitlab_domain }}:{{ cookiecutter.gitlab_account}}/{{ cookiecutter.project_name}}.git
git add .
git commit -m "Initial commit"
git push -u origin main
```


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
