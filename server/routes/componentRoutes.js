import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getComponentsByUser,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponentById,
} from '../utils/dbService.js';

const router = express.Router();

// All component routes require authentication
router.use(protect);

// @desc    Get all saved components for the logged-in user
// @route   GET /api/components
// @access  Private
router.get('/', async (req, res) => {
  try {
    const components = await getComponentsByUser(req.user._id);
    res.status(200).json(components);
  } catch (error) {
    console.error('Fetch components error:', error);
    res.status(500).json({ message: 'Failed to fetch saved components' });
  }
});

// @desc    Get single component by ID
// @route   GET /api/components/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const component = await getComponentById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    const compUser = component.user || component.userId;
    if (compUser.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this component' });
    }
    res.status(200).json(component);
  } catch (error) {
    console.error('Fetch single component error:', error);
    res.status(500).json({ message: 'Failed to fetch component' });
  }
});

// @desc    Save a new generated component
// @route   POST /api/components
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, prompt, framework, code, refinements } = req.body;

    if (!prompt || !code) {
      return res.status(400).json({ message: 'Prompt and code are required' });
    }

    const component = await createComponent({
      user: req.user._id,
      title: title || prompt.slice(0, 30) + '...',
      prompt,
      framework: framework || 'html-css',
      code,
      refinements: refinements || [],
    });

    res.status(201).json(component);
  } catch (error) {
    console.error('Save component error:', error);
    res.status(500).json({ message: 'Failed to save component' });
  }
});

// @desc    Update a component
// @route   PUT /api/components/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const updatedComponent = await updateComponent(req.params.id, req.user._id.toString(), req.body);
    if (!updatedComponent) {
      return res.status(404).json({ message: 'Component not found or unauthorized' });
    }
    res.status(200).json(updatedComponent);
  } catch (error) {
    console.error('Update component error:', error);
    res.status(500).json({ message: 'Failed to update component' });
  }
});

// @desc    Delete a component
// @route   DELETE /api/components/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const success = await deleteComponentById(req.params.id, req.user._id.toString());
    if (!success) {
      return res.status(404).json({ message: 'Component not found or unauthorized' });
    }
    res.status(200).json({ id: req.params.id, message: 'Component removed successfully' });
  } catch (error) {
    console.error('Delete component error:', error);
    res.status(500).json({ message: 'Failed to delete component' });
  }
});

export default router;
