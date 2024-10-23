import projectsData from '../data/projects.json';
import contactData from '../data/contact.json';

export const loadProjects = async () => {
  const projects = await Promise.all(
    projectsData.map(async (project) => {
      const module = await import(`../data/${project.id}.json`);
      return module.default;
    })
  );
  return projects;
};

export const loadContact = () => contactData;
