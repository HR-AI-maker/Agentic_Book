# Validation Checklist: Physical AI Textbook

## Core Requirements (100 points)

### Textbook Content
- [ ] Module 1 (ROS 2): 4 chapters complete
- [ ] Module 2 (Gazebo/Unity): 3 chapters complete
- [ ] Module 3 (NVIDIA Isaac): 4 chapters complete
- [ ] Module 4 (VLA): 4 chapters complete
- [ ] All chapters have code examples
- [ ] Content renders correctly in Next.js

### RAG Chatbot
- [ ] Chat endpoint responds to questions
- [ ] Answers are based on textbook content
- [ ] Sources are cited in responses
- [ ] Selected text context works
- [ ] Response time < 5 seconds

### Infrastructure
- [ ] Qdrant Cloud collection created
- [ ] All chapters indexed in Qdrant
- [ ] Neon Postgres database setup
- [ ] Environment variables configured
- [ ] CORS working between frontend/backend

### Deployment
- [ ] Frontend deployed to Vercel
- [ ] API routes accessible
- [ ] Live URL working
- [ ] No console errors

---

## Bonus: Authentication (50 points)

- [ ] Better-auth configured
- [ ] Signup form with background questions
- [ ] Login form working
- [ ] Session persistence
- [ ] Protected routes

---

## Bonus: Personalization (50 points)

- [ ] Personalization API endpoint
- [ ] Personalize button on chapters
- [ ] Content adjusts based on user level
- [ ] Loading states shown

---

## Bonus: Translation (50 points)

- [ ] Translation API endpoint
- [ ] Urdu translation button
- [ ] RTL layout support
- [ ] Toggle back to English

---

## Final Checks

- [ ] Demo video < 90 seconds
- [ ] GitHub repo is public
- [ ] All features demonstrated
- [ ] Form submitted with all links
