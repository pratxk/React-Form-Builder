# React Form Builder

A powerful form builder application built with React, TypeScript, and Material-UI that allows you to create, configure, and preview dynamic forms.

## Features

### 🎯 Core Features
- **Drag & Drop Field Reordering**: Reorder form fields by dragging and dropping them
- **Multiple Field Types**: Support for text, number, textarea, select, radio, checkbox, and date fields
- **Field Configuration**: Configure labels, validation rules, and field properties
- **Form Preview**: Real-time preview of your form with validation
- **Form Submission**: Submit forms and view JSON response data
- **Form Management**: Save, load, and manage multiple forms

### 🎨 Enhanced Form Preview
- **Interactive Form Testing**: Fill out and test your forms in real-time
- **Real-time Validation**: See validation errors as you type
- **JSON Response Preview**: View exactly how form data will be structured when submitted
- **Tabbed Interface**: Switch between form preview and JSON response views
- **Success Notifications**: Get feedback when forms are successfully submitted

### 🔧 Field Configuration
- **Validation Rules**: Add multiple validation rules per field
  - Required field validation
  - Minimum/Maximum length validation
  - Email format validation
  - Password strength validation
  - Custom error messages
- **Derived Fields**: Create calculated fields based on other field values
- **Field Options**: Configure options for select and radio fields
- **Default Values**: Set default values for form fields

### 📱 User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Interface**: Clean, modern UI with Material-UI components
- **Drag & Drop**: Smooth drag and drop functionality for field reordering
- **Visual Feedback**: Clear visual indicators for drag operations and validation states

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ReactFormBuilder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Form

1. **Add Fields**: Use the "Add Fields" panel to add different types of form fields
2. **Configure Fields**: Click the settings icon on any field to configure its properties
3. **Reorder Fields**: Drag and drop fields to change their order
4. **Set Validations**: Add validation rules to ensure data quality
5. **Save Form**: Give your form a name and save it for later use

### Previewing and Testing

1. **Preview Form**: Click the "Preview" button to see how your form looks
2. **Fill Out Form**: Test your form by filling out the fields
3. **Submit Form**: Click "Submit Form" to see the JSON response
4. **View Response**: Switch to the "JSON Response" tab to see the structured data

### Managing Forms

1. **View Saved Forms**: Navigate to "My Forms" to see all saved forms
2. **Edit Forms**: Click on any saved form to edit it
3. **Delete Forms**: Remove forms you no longer need

## Technical Details

### Dependencies
- **React 19**: Latest React with hooks and modern features
- **TypeScript**: Type-safe development
- **Material-UI**: Professional UI components
- **@dnd-kit**: Modern drag and drop library
- **Lucide React**: Beautiful icons

### Project Structure
```
src/
├── components/          # React components
│   ├── DraggableFieldList.tsx    # Drag & drop field list
│   ├── EnhancedFormPreview.tsx   # Enhanced form preview
│   ├── FieldConfiguration.tsx    # Field configuration panel
│   └── ...              # Other UI components
├── store/              # State management
│   └── useFormStore.ts # Form state store
├── types/              # TypeScript type definitions
│   └── types.ts        # Form and field types
└── App.tsx             # Main application component
```

### Key Features Implementation

#### Drag & Drop Field Reordering
- Uses `@dnd-kit` for smooth drag and drop functionality
- Visual feedback during drag operations
- Maintains field order in form state

#### Form Validation
- Real-time validation as users type
- Multiple validation rule types
- Custom error messages
- Prevents form submission when validation fails

#### JSON Response Preview
- Shows exact structure of submitted form data
- Includes metadata like form ID, name, and submission timestamp
- Formatted for easy reading and debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
