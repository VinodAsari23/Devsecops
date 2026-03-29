Screenshots Needed for Construction Progress Tracker Report
===========================================================

Place the following screenshot image files in this directory.
Update the corresponding \fbox{} placeholders in main.tex with
\includegraphics commands once images are available.

1. architecture-diagram.png
   - Figure 1: High-level system architecture diagram
   - Show three-tier layout: React frontend, FastAPI backend, PostgreSQL database
   - Include Nginx reverse proxy, systemd, and AWS EC2 boundary
   - Show request flow arrows from client through Nginx to FastAPI to PostgreSQL

2. erd-diagram.png
   - Figure 2: Entity-Relationship Diagram
   - Show three tables: users, projects, tasks
   - Include all columns, data types, primary keys, and foreign keys
   - Show relationships: users 1--* projects (owner_id), projects 1--* tasks (project_id)

3. dashboard-screenshot.png
   - Figure 3: Application dashboard screenshot
   - Log in as examiner / ConstructTrack2024 (MANAGER role)
   - Capture the main dashboard showing project list with progress bars
   - Show project names, statuses, and task counts
   - URL bar should show http://3.238.107.20

4. cicd-pipeline.png
   - Figure 4: CI/CD pipeline diagram or GitHub Actions screenshot
   - Show the four jobs: Build & Test, Static Analysis, Security Scan, Deploy to AWS
   - Ideally capture a successful pipeline run from GitHub Actions tab
   - Alternative: create a flowchart showing the four sequential jobs

5. security-scan-results.png
   - Figure 5: Security scanning results
   - Capture Trivy scan output showing the 4 CVEs
   - Optionally include OWASP ZAP scan summary
   - Can be a composite image showing both tool outputs

6. aws-deployment-diagram.png
   - Figure 6: AWS deployment architecture diagram
   - Show EC2 instance with internal components (Nginx, FastAPI, PostgreSQL)
   - Show surrounding AWS services: Security Groups, IAM Role, SSM Parameter Store,
     Key Pairs, CloudWatch Logs
   - Include network boundaries (VPC, subnet, internet gateway)

7. pytest-results.png
   - Figure 7: Pytest test suite results
   - Capture from GitHub Actions showing all 20 tests passing
   - Alternative: terminal output of pytest with 20 passed, 0 failed

Optional Additional Screenshots:
- login-page.png: Login page of the application
- project-detail.png: Individual project view showing tasks and progress
- task-management.png: Task creation or editing form
- github-actions-workflow.png: Full workflow YAML or Actions overview page
- cloudwatch-logs.png: CloudWatch Logs console showing application logs
- security-groups.png: AWS Security Groups configuration in console
