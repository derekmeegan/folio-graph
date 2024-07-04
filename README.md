# Folio Social

![alt text](./screenshot.png?raw=true)

Visualizing how you are connected to other investors. Folio Social is a React application that demonstrates how people relate to each other through common investments. The goal of this app is to bring to life the idea that the financial world is inherently social. It leverages the Plaid API to seamlessly capture relevant investment information and display your portfolio in an interconnected web.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [Contact](#contact)

## Overview

The target audience for this app includes individuals who are interested in finances. The unique social experience provided by the app is its graph interface, where users can observe the density and relationships among portfolios and investments.

## Tech Stack

The project utilizes the following technologies:

- **React**: Frontend framework
- **React Force Graph**: Visualizing relationships
- **Plaid API**: Linking users investments
- **Tailwind CSS**: Styling
- **Supabase**: Backend
- **Google Cloud Functions**: Backend data processing using Python

This stack was chosen primarily for speed of iteration.

## Usage

To use the application, users will sign up through our deployed application. Deployment is currently in progress.

## Contributing

### Step 1: Create an Issue to Request Access

1. Go to the project's GitHub repository.
2. Navigate to the "Issues" tab.
3. Click on "New issue."
4. Use the provided issue template to request access. Here’s an example template:

   **Issue Template for Secret Access Request:**
   ```markdown
    ---
    name: Access Request
    about: Use this template to request access to sensitive resources or secrets.
    title: "[Access Request] - <Contributor Name>"
    labels: access request
    assignees: ''
    
    ---
    
    ## Contributor Details
    - **Name:** 
    - **GitHub Username:** 
    - **Email:** 
    - **Role/Position:**
    
    ## Resources Requested
    - **Resource/Secret Name:** 
    - **Access Level Needed:**
    - **Reason for Access:**
    
    ## Purpose of Access
    Provide a brief description of why you need access to the requested resources. Include any relevant project details or tasks.
    
    ## Duration of Access
    - **Start Date:** 
    - **End Date:** (if applicable)
    
    ## Approval
    - **Approving Manager/Maintainer:** 
    - **Date of Approval:** 
    Acceptance Criteria:

### Step 2: Approval and Access

- Once your request is approved, you will be added to the Google Cloud project as a Secrets Accessor.
- You will receive a notification confirming your access.

### Step 3: Download the gcloud CLI

- Download and install the Google Cloud SDK (gcloud CLI) from the official [Google Cloud SDK documentation](https://cloud.google.com/sdk/docs/install).

### Step 4: Clone the Repository

1. Clone the repository to your local machine:
   ```sh
   git clone https://github.com/your-username/your-repository.git
   ```
2. Navigate to the project directory:
    ```sh
    cd your-repository
    ```

### Step 5: Execute the Shell Script

1. Open your project directory in your terminal.
2. Ensure the shell script (`create_env.sh`) is executable by running:
   ```sh
   chmod +x create_env.sh
   ```
3. Run the shell script:
   ```sh
   ./create_env.sh
   ```
### Step 7: Build and Start the App

1. Install the project dependencies:
   ```sh
   npm install
   ```
2. Build and run the application
   ```sh
   npm run build && npm start
   ```

## Contact

For inquiries or contributions, you can reach out to derek@folio-social.com.
   
