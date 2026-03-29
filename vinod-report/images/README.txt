Screenshots needed for the Vinod Yadhav Research Paper Annotation Tool report
=============================================================================

Place the following PNG/JPG files in this directory:

1. login_page.png
   - The login screen with username and password fields
   - Show the "Research Paper Annotation Tool" branding

2. dashboard.png
   - Main dashboard after login showing the sidebar navigation (dark left panel)
   - Show the white main content area with paper listings

3. sidebar_navigation.png
   - Close-up of the dark sidebar panel showing navigation links:
     Dashboard, Papers, Annotations, Search, Admin (if ADMIN role)

4. paper_list.png
   - The papers listing page showing paper cards/table
   - Include at least 2-3 papers visible

5. paper_create.png
   - The "Add New Paper" form showing fields:
     title, authors, abstract, publication_url, publication_year

6. paper_detail.png
   - A single paper detail view showing metadata and annotations list

7. annotation_create.png
   - The annotation creation form showing fields:
     highlighted_text, annotation_note, category dropdown, page_number

8. annotation_categories.png
   - Dropdown or view showing the 6 annotation categories:
     KEY_FINDING, METHODOLOGY, QUESTION, CRITIQUE, REFERENCE, OTHER

9. search_feature.png
   - The full-text search interface with a sample query and results

10. admin_panel.png
    - The admin user management view (logged in as ADMIN role)

11. duplicate_detection.png
    - Error message showing 409 conflict when adding a duplicate paper title

12. architecture_diagram.png
    - System architecture diagram showing:
      Browser -> Nginx -> FastAPI -> PostgreSQL on EC2
      GitHub Actions CI/CD pipeline
      AWS services (EC2, SG, SSM, IAM, Key Pairs, CloudWatch)

13. erd_diagram.png
    - Entity-Relationship Diagram for the 3 tables:
      users, papers, annotations with relationships

14. cicd_pipeline.png
    - GitHub Actions pipeline showing 4 jobs:
      Build & Test, Static Analysis, Security Scan, Deploy to AWS

15. security_scan_results.png
    - Trivy or OWASP ZAP scan output showing results

16. pytest_results.png
    - Terminal output showing 20 pytest tests passing
