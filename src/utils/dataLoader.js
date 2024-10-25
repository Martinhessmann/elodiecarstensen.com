import projectsData from '../data/projects.json';
import aboutData from '../data/about.json';

export const loadProjects = async () => {
  const projects = await Promise.all(
    projectsData.map(async (project) => {
      if (project.id === 'about') {
        return { ...project, ...aboutData };
      }
      const module = await import(`../data/${project.id}.json`);
      return module.default;
    })
  );
  return projects;
};

export const loadAbout = () => aboutData;
