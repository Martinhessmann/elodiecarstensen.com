import projects from '../data/projects.json';

// Define project abbreviations as tags
export const PROJECT_TAGS = {
  'AOPS': 'absence-of-promised-safety',
  'DNS': 'des-nachtmahrs-schmetterlinge',
  'ALV': 'alluvial'
};

export const getProjectLink = (tag) => {
  const projectId = PROJECT_TAGS[tag];
  return projectId ? {
    id: projectId,
    abbr: tag
  } : null;
};