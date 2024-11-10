# Momentum - AI-Assisted Journaling App

Momentum is an AI-powered journaling app that helps you reflect on your day through text, photos, and smart prompts. With ML features, it assists you by generating questions, suggesting titles, and beautifully organizing photos, making it simple to capture life's moments - Zain & Haadi

## Features
- AI-generated journaling prompts to help kickstart reflections.
- Auto-suggested titles based on your entries.
- Organized photo layouts to tell a visual story.
- Clean and simple UI to focus on your thoughts.

## Tech Stack
- **Backend**: Supabase for serverless databases, authentication, and cloud functions.
- **Frontend**: Flutter for cross-platform development targeting iOS.
- **AI/ML**: Incorporate text generation and summarization techniques using open-source models or API services.

## Getting Started
1. **Set Up the Backend**
   - **Supabase Setup**: Create an account on Supabase and start a new project.
   - **Database Configuration**: Set up the necessary tables in Supabase:
     - `users`: Store user profile information (e.g., email, username, password hash).
     - `journal_entries`: Store individual journal entries, including user ID references, text content, and timestamps.
     - `images`: Store images associated with journal entries, including user ID references, image URLs, and entry references.
     - `ai_prompts`: Store potential AI-generated prompts for journaling.
   - **Authentication**: Configure Supabase authentication for user sign-up, login, and password management.
   - **Cloud Functions**: Set up Supabase cloud functions to handle AI-based operations, such as prompt suggestions.

2. **App Development**
   - **Framework Selection**: Use Flutter to build the user interface and support cross-platform compatibility.
   - **UI Design**: Design the app UI in Flutter, focusing on a clean, minimalist interface with dedicated sections for journaling, photos, and AI prompts.
   - **Frontend-Backend Integration**:
     - Connect the Flutter app with Supabase by adding the Supabase Flutter SDK.
     - Set up API keys and environment variables to securely access the backend.
     - Develop services for handling CRUD (Create, Read, Update, Delete) operations for journal entries and images.
   - **Local Database Implementation**:
     - Use `sqflite` for local data storage to provide offline access to journal entries.
     - Create methods for syncing local data with Supabase once the device is back online.

3. **AI/ML Integration**
   - **Prompts & Titles**:
     - Integrate an open-source natural language processing (NLP) model (e.g., GPT-based) to generate journaling prompts and suggest titles.
     - Implement an API service to call the NLP model with relevant user context (e.g., mood tags, recent entries).
   - **Picture Organization**:
     - Use a computer vision model (e.g., TensorFlow Lite or an API like Google Vision) to classify and tag images.
     - Develop a logic to arrange photos based on context or relevance to the journal entry.

4. **Core Features Development**
   - **User Authentication**:
     - Develop user sign-up, login, and logout functionality in Flutter using Supabase authentication.
     - Implement password reset and email verification features.
   - **Journal Entry Creation**:
     - Create a screen for adding journal entries, including text input and image uploads.
     - Integrate AI assistance to provide writing prompts and title suggestions while users type.
   - **Image Handling**:
     - Allow users to upload and associate images with journal entries.
     - Implement automatic photo arrangement using the AI model.
   - **AI Assistance**:
     - Create an AI-powered suggestions widget that provides prompts and suggested edits as users write.

5. **Testing**
   - **Unit Testing**:
     - Write unit tests for individual components in Flutter, including authentication, data handling, and AI integrations.
   - **Integration Testing**:
     - Test the integration between the frontend and Supabase backend, focusing on data consistency and error handling.
   - **User Testing**:
     - Conduct user testing sessions to validate the AI-generated prompts and ensure they improve the journaling experience.

6. **Deployment**
   - **iOS Deployment**:
     - Set up an Apple Developer account and configure necessary certificates and provisioning profiles in Xcode.
     - Build and test the Flutter app on an iOS simulator and physical devices.
     - Submit the app to the App Store for review.
   - **Backend Deployment**:
     - Ensure Supabase is properly configured and secure before going live.
     - Set up monitoring and logging for Supabase functions to track usage and errors.

## Running Locally
1. Clone the repo.
   ```bash
   git clone https://github.com/yourusername/momentum-journal.git
   ```
2. Set up the Supabase environment:
   - Create a `.env` file in the root of your Flutter project.
   - Add your Supabase project URL and API key to the `.env` file.
3. Install dependencies.
   ```bash
   flutter pub get
   ```
4. Run the app on your preferred simulator or physical device.
   ```bash
   flutter run
   ```
