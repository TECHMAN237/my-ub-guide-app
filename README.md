# My UB Guide

**Your Journey at the University of Buea Starts Here.**

My UB Guide is an AI-powered university orientation application designed to help prospective and enrolled students understand the University of Buea (UB), Cameroon. Its main experience is a conversational assistant that helps users find guidance about programs, admissions, school fees, academic procedures, and university life.

> **Project status:** MVP in development. Features, integrations, and deployment configuration should be verified against the current source code before being described as production-ready.

## Table of contents

- [Project goals](#project-goals)
- [Who it serves](#who-it-serves)
- [Core capabilities](#core-capabilities)
- [AI assistant and knowledge base](#ai-assistant-and-knowledge-base)
- [Voice and language support](#voice-and-language-support)
- [Design principles](#design-principles)
- [Technology and architecture](#technology-and-architecture)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Knowledge-base maintenance](#knowledge-base-maintenance)
- [Testing and verification](#testing-and-verification)
- [Deployment](#deployment)
- [Security and privacy](#security-and-privacy)
- [Known limitations and development notes](#known-limitations-and-development-notes)
- [Contributing](#contributing)

## Project goals

My UB Guide aims to:

- Make university information easier to understand and access.
- Help prospective students explore programs and admission requirements.
- Help enrolled students understand academic processes and regulations.
- Personalize guidance using the user's category and relevant academic profile.
- Provide a chatbot-first experience that is simple to use on mobile devices.
- Support English and French where the configured AI and speech services allow.
- Avoid unsupported claims by grounding university-specific answers in available reference material.

## Who it serves

### 1. Prospective students

People who are considering studying at UB or have not yet enrolled can use the app to explore topics such as:

- Faculties, departments, and programs.
- Qualifications and certificates.
- Admission requirements and application procedures.
- School fees and other charges, when documented.
- Required documents and application steps.
- Program duration and relevant university resources.

Prospective users should be able to leave undecided profile fields blank until they know what they want to study.

### 2. Enrolled students

Students already enrolled at UB can seek guidance about:

- Course registration and academic procedures.
- School-fee payment processes and deadlines, when documented.
- Credit limits and additional-credit rules, when documented.
- Academic calendars and examination information, when documented.
- Faculty and department information.
- Student resources and campus services.

Personalized answers should use relevant profile fields, such as faculty, department, program, level, semester, academic year, and preferred language. Profile information alone is not proof of an official university rule.

## Core capabilities

The intended MVP experience includes:

- A landing/welcome page introducing My UB Guide.
- Sign-up, login, and profile onboarding, according to the current implementation.
- Selection between prospective and enrolled student journeys.
- A chatbot-first home page.
- Conversation history and contextual follow-up questions, where implemented.
- University knowledge retrieval from the project's Markdown knowledge base.
- Source references when reliable source metadata is available.
- English/French preferences where supported.
- Voice input and spoken responses when the required services are configured.
- Responsive layouts for phones, tablets, and desktop screens.

This list describes product goals. Check the current source code and deployment configuration to determine which features are fully implemented and enabled.

## AI assistant and knowledge base

### Gemma requirement

The intended primary text-generation model for the chatbot is **Google Gemma**.

The application must use a model identifier and inference endpoint that are actually supported by the configured provider. Do not silently substitute Gemini or another model for live chatbot text generation.

The availability of Gemini credentials in Google AI Studio does not automatically mean that every Gemma model or every Google Cloud service is accessible through the same endpoint or credentials. Verify the model and endpoint configuration against the provider's current documentation.

If the configured Gemma endpoint is unavailable, the app should report a useful error rather than pretending a request succeeded or silently changing model families.

### Knowledge-base grounding

The project includes a Markdown university knowledge base under `src/` (use the actual filename in the repository). The chatbot should load and search this content and include relevant passages in the model request.

The intended flow is:

1. Receive the student's question.
2. Identify the user's category and relevant profile context.
3. Retrieve relevant passages from the knowledge base.
4. Pass the instructions, relevant context, retrieved evidence, and necessary conversation history to the configured Gemma model.
5. Display the answer and supporting source references where available.

The assistant must not invent official fees, deadlines, admission requirements, credit limits, academic regulations, program details, or university contacts.

If the available reference material does not establish an answer, the assistant should say that the information could not be verified and direct the student to an official source or office when a reliable reference is available.

### Instructions document

The assistant's behavioral instructions should be integrated into an appropriate source-code module and explicitly included in the AI request pipeline. Merely storing an instruction Markdown file in the repository does not cause the model to read it automatically.

Keep the instructions centralized and maintainable. Preserve the original reference document if it is still used by the development workflow.

## Voice and language support

The intended voice experience allows a student to speak a question, review the transcription, and submit it to the assistant. Where configured, students can also listen to answers.

These capabilities may use supported services such as:

- Google Cloud Speech-to-Text or another verified Google transcription capability.
- Google Cloud Text-to-Speech.
- Google Cloud Translation when translation is needed.
- Browser-native speech recognition or speech synthesis as optional fallbacks where supported.

These services are distinct. Translation does not perform speech transcription, and not every Gemini or Gemma endpoint supports raw audio. Verify the capabilities of the actual endpoint and browser environment.

Separate Google Cloud services may require separate setup, permissions, project configuration, or credentials. Do not assume that a Gemini API key automatically enables all Google Cloud services.

Voice requirements:

- Keep text chat usable when voice services are unavailable.
- Allow users to review and edit a transcript before submitting it.
- Clearly communicate recording and transcription states.
- Handle denied microphone permissions and unsupported browsers.
- Do not expose service-account credentials in frontend code.
- Avoid unnecessary retention of raw audio.

## Design principles

- **Chatbot first:** the assistant is the primary experience on the home page.
- **Mobile first:** support small screens without horizontal overflow.
- **White-dominant welcome page:** use a clean, professional white interface with restrained blue accents, consistent with the approved design direction.
- **Preserve brand styling:** do not change established colors, typography, logos, or theme when a task requests layout-only changes.
- **Accessible controls:** provide readable text, clear focus states, and usable button sizes.
- **Functional UI:** buttons and navigation should perform real actions; avoid fake controls and placeholder behavior in live flows.

## Technology and architecture

The exact stack must be confirmed from the repository's `package.json`, build configuration, and source files. The project has been developed around a web application workflow and may include React/TypeScript, a Google AI inference integration, and deployment on Vercel.

Do not assume a dependency, backend, database, authentication provider, or API is configured unless it exists in the current codebase.

Recommended architectural boundaries:

- **UI layer:** pages, reusable components, forms, chat interface, navigation.
- **AI service:** one centralized function for generating university answers.
- **Instruction module:** centralized assistant behavior and policy instructions.
- **Knowledge-base service:** load, parse, search, and return relevant Markdown sections.
- **Provider adapter:** encapsulate the actual supported Gemma inference API.
- **Voice services:** separate adapters for transcription, speech synthesis, and translation.
- **Configuration:** centralized model and service settings, with secrets kept server-side where required.

Keep the MVP lightweight. Do not add a vector database, microservices, or other infrastructure unless the existing requirements justify it.

## Getting started

The commands below are typical for a Node.js web application. Confirm the actual package manager and scripts in `package.json` before using them.

### Prerequisites

- Git.
- A supported Node.js version for the project.
- The package manager used by the repository (npm, pnpm, or yarn).
- Required AI provider credentials for live inference.
- Additional Google Cloud configuration only if the selected voice or translation services require it.

### Install dependencies

```bash
npm install
```

If the repository uses `pnpm` or `yarn`, use its existing lockfile and the corresponding package manager instead.

### Configure environment variables

1. Inspect the project's environment example and configuration code.
2. Create a local `.env.local` or the environment file expected by the framework.
3. Add only the variables actually required by the current implementation.
4. Keep private credentials out of source control.

Do not copy example variable names blindly. The real names must match the code.

### Run the development server

Check the available scripts:

```bash
npm run
```

Then use the script defined by the project, commonly:

```bash
npm run dev
```

Open the local URL printed by the development server.

### Build the application

```bash
npm run build
```

Run the project's test command if one is defined in `package.json`.

## Environment configuration

Use the actual configuration names found in the project. Potential configuration categories include:

| Configuration | Purpose |
|---|---|
| Gemma model identifier | Selects a verified, supported Gemma model |
| AI provider credentials | Authenticates requests to the configured inference provider |
| Google Cloud project/location | Used only by services that require them |
| Speech-to-Text settings | Enables a configured transcription service |
| Text-to-Speech settings | Enables a configured speech synthesis service |
| Translation settings | Enables a configured translation service |

Do not require unused variables. Do not store secret keys in variables exposed to browser bundles (for example, public-prefixed frontend variables). For services that require private credentials, use a secure server-side route or the provider's recommended authentication flow.

If a service is not configured, display a clear unavailable state and keep unrelated app functionality working.

## Knowledge-base maintenance

When adding or updating university information:

1. Edit the existing knowledge-base Markdown file in the repository.
2. Preserve meaningful headings and clear sections.
3. Include a reliable source title or URL when available.
4. Include an update date when known.
5. Clearly distinguish verified facts from unverified or demonstration content.
6. Do not invent official policies or fill gaps with guesses.
7. Test that the updated content is included in the build and retrieved by the chatbot.

The knowledge-base loader must use a runtime/build-compatible mechanism. A Markdown file being present in `src/` does not guarantee that its content is available to production code.

Keep the knowledge base as the primary source for institution-specific answers. If sources conflict or appear outdated, the assistant should disclose uncertainty rather than choose an arbitrary answer.

## Testing and verification

Unit tests should mock external AI and speech services so ordinary tests do not require live credentials.

Important test areas include:

- Prospective and enrolled student flows.
- Profile setup and relevant context.
- Chat submission, loading, retry, and errors.
- Correct model selection and no silent fallback.
- Knowledge-base loading, parsing, search, and retrieval.
- Retrieved evidence included in the model request.
- Source references preserved accurately.
- Unknown university facts handled without fabrication.
- Voice permissions, transcription review, and failure handling.
- Speech playback and language preferences.
- Navigation and responsive layouts.

Use the test framework already present in the project. Do not report tests as passing unless they have actually been run.

## Deployment

The current project has been associated with Vercel deployment. Verify the actual deployment configuration and connected repository before changing production settings.

Before deploying:

1. Run the production build.
2. Run available tests.
3. Confirm the knowledge-base file is included and accessible in production.
4. Confirm the configured model endpoint and required credentials.
5. Configure any required server-side environment variables in the hosting provider.
6. Verify that secrets are not included in the client bundle.
7. Test the landing page, onboarding, chatbot, and main navigation.
8. Test voice features only when their services and permissions are configured.
9. Confirm that unavailable services fail gracefully.
10. Test the deployed URL, not only the local development server.

Do not claim production readiness until the actual deployment has been verified.

## Security and privacy

- Never commit API keys, service-account JSON files, passwords, or other secrets.
- Do not expose private provider credentials in frontend code.
- Minimize profile information sent to the AI model.
- Validate incoming requests and uploaded audio.
- Use reasonable request and recording limits.
- Avoid unnecessary logging or retention of personal data and raw audio.
- Clearly distinguish mock/demo mode from live services.
- Do not claim that local/demo authentication is production-secure.
- Do not claim official integration with UB student records unless a real, authorized integration exists.

## Known limitations and development notes

- The app is an MVP; feature completeness depends on the current code and configuration.
- The knowledge base may not contain every current university policy. Missing information must not be invented.
- Gemma model availability depends on the configured provider and supported endpoint.
- Speech transcription, speech synthesis, and translation may require separate service configuration.
- Browser microphone and speech features vary by browser and device.
- A successful frontend build does not prove that live AI or external services work.
- Any demo data must be labeled and must not be presented as verified official UB information.

## Contributing

When working on My UB Guide:

1. Inspect the existing implementation before changing it.
2. Preserve working features and the current technology stack where practical.
3. Make focused, maintainable changes.
4. Keep AI instructions and knowledge retrieval centralized.
5. Use verified sources for university-specific information.
6. Add or update tests for changed behavior.
7. Run the build and tests available in the repository.
8. Document new configuration requirements.
9. Never silently substitute the required Gemma model or fake an external integration.
10. Report what changed, what was tested, and what remains unconfigured.

---

**My UB Guide — helping prospective and enrolled students navigate the University of Buea with clearer, more accessible guidance.**
