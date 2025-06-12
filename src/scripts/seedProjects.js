import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedProjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/project", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected for project seeding');

    // Clear existing projects if you want to start fresh
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Get users to assign as owners, team members, and resource creators
    const users = await User.find({});
    if (users.length === 0) {
      throw new Error('No users found in database. Seed users first.');
    }

    // Current date and future dates for project timelines
    const now = new Date();
    const futureDate1 = new Date();
    futureDate1.setMonth(now.getMonth() + 1);
    const futureDate2 = new Date();
    futureDate2.setMonth(now.getMonth() + 2);
    const futureDate3 = new Date();
    futureDate3.setMonth(now.getMonth() + 3);
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - 1);

    const projectsData = [
      {
        name: 'DNS Automation',
        description: 'Automate DNS record management for ZCHPC infrastructure',
        status: 'in-progress',
        startDate: now,
        endDate: futureDate3,
        tasks: [
          {
            title: 'Research DNS automation tools',
            description: 'Evaluate tools like PowerDNS, Knot DNS, and others',
            status: 'done',
            weight: 3,
            priority: 'high'
          },
          {
            title: 'Implement API endpoints',
            description: 'Create REST API for DNS management',
            status: 'in-progress',
            weight: 5,
            priority: 'high'
          }
        ],
        resources: [
          {
            name: 'PowerDNS Documentation',
            type: 'link',
            url: 'https://doc.powerdns.com/',
            description: 'Official PowerDNS documentation'
          }
        ]
      },
      {
        name: 'Xen Orchestra Customization',
        description: 'Customize Xen Orchestra for ZCHPC needs',
        status: 'in-progress',
        startDate: now,
        endDate: futureDate3,
        tasks: [
          {
            title: 'Implement full screen mode',
            description: 'Customize Xen Orchestra for full screen operation',
            status: 'todo',
            weight: 2,
            priority: 'medium'
          },
          {
            title: 'Self-service registration',
            description: 'Allow users to self-register for VM access',
            status: 'todo',
            weight: 4,
            priority: 'high'
          }
        ],
        resources: [
          {
            name: 'Xen Orchestra GitHub',
            type: 'link',
            url: 'https://github.com/vatesfr/xen-orchestra',
            description: 'Xen Orchestra source code'
          }
        ]
      },
      {
        name: 'CP Automation Self Service',
        description: 'Create self-service portal for CP automation',
        status: 'not-started',
        startDate: futureDate1,
        tasks: [
          {
            title: 'Design user interface',
            description: 'Create mockups for self-service portal',
            status: 'todo',
            weight: 3,
            priority: 'medium'
          }
        ]
      },
      {
        name: 'Mail Customization',
        description: 'Customize mail server configuration for ZCHPC',
        status: 'not-started',
        startDate: futureDate2,
        tasks: [
          {
            title: 'Evaluate mail server options',
            description: 'Compare Postfix, Exim, and others',
            status: 'todo',
            weight: 4,
            priority: 'medium'
          }
        ]
      },
      {
        name: 'Virtual Labs',
        description: 'Implement virtual lab environment for researchers',
        status: 'on-hold',
        startDate: pastDate,
        tasks: [
          {
            title: 'Hardware provisioning',
            description: 'Allocate servers for virtual labs',
            status: 'in-progress',
            weight: 6,
            priority: 'high'
          }
        ]
      },
      {
        name: 'Server Mirroring',
        description: 'Implement server mirroring for high availability',
        status: 'in-progress',
        startDate: now,
        tasks: [
          {
            title: 'Configure DRBD',
            description: 'Set up DRBD for block-level replication',
            status: 'in-progress',
            weight: 5,
            priority: 'critical'
          }
        ]
      },
      {
        name: 'Drive OnlyOffice Customization',
        description: 'Customize OnlyOffice integration with Nextcloud',
        status: 'not-started',
        startDate: futureDate3,
        tasks: [
          {
            title: 'Test OnlyOffice integration',
            description: 'Verify document editing functionality',
            status: 'todo',
            weight: 2,
            priority: 'medium'
          }
        ]
      },
      {
        name: 'Backup System',
        description: 'Implement comprehensive backup solution',
        status: 'in-progress',
        startDate: now,
        tasks: [
          {
            title: 'Evaluate backup tools',
            description: 'Compare Borg, Restic, Duplicacy',
            status: 'done',
            weight: 3,
            priority: 'high'
          },
          {
            title: 'Implement backup schedule',
            description: 'Set up regular backup jobs',
            status: 'in-progress',
            weight: 4,
            priority: 'high'
          }
        ]
      },
      {
        name: 'Network Monitoring',
        description: 'Implement comprehensive network monitoring',
        status: 'in-progress',
        startDate: now,
        tasks: [
          {
            title: 'Deploy monitoring agents',
            description: 'Install on all critical network devices',
            status: 'in-progress',
            weight: 5,
            priority: 'high'
          }
        ]
      },
      {
        name: 'Power Monitoring',
        description: 'Implement power usage monitoring system',
        status: 'not-started',
        startDate: futureDate3
      },
      {
        name: 'eSight Implementation',
        description: 'Deploy Huawei eSight for network management',
        status: 'not-started',
        startDate: futureDate3
      },
      {
        name: 'Generator Integration',
        description: 'Integrate generator with monitoring system',
        status: 'not-started',
        startDate: futureDate3
      },
      {
        name: 'Camera Integration',
        description: 'Integrate security cameras with central system',
        status: 'not-started',
        startDate: futureDate3
      },
      {
        name: 'CLUTTER with Open OnDemand',
        description: 'Implement Open OnDemand for CLUTTER cluster',
        status: 'in-progress',
        startDate: now,
        tasks: [
          {
            title: 'Install Open OnDemand',
            description: 'Deploy on cluster head node',
            status: 'in-progress',
            weight: 5,
            priority: 'high'
          }
        ]
      },
      {
        name: 'Odoo Implementation',
        description: 'Deploy Odoo ERP for ZCHPC',
        status: 'not-started',
        startDate: futureDate3
      },
      {
        name: 'Moodle Deployment',
        description: 'Deploy Moodle learning management system',
        status: 'not-started',
        startDate: futureDate3
      },
      {
        name: 'BigBlueButton Deployment',
        description: 'Deploy BigBlueButton for video conferencing',
        status: 'not-started',
        startDate: futureDate3
      },
      {
        name: 'Zabbix Deployment',
        description: 'Deploy Zabbix for infrastructure monitoring',
        status: 'in-progress',
        startDate: now,
        tasks: [
          {
            title: 'Install Zabbix server',
            description: 'Set up central Zabbix server',
            status: 'done',
            weight: 3,
            priority: 'high'
          },
          {
            title: 'Configure monitoring templates',
            description: 'Create templates for different device types',
            status: 'in-progress',
            weight: 4,
            priority: 'high'
          }
        ]
      }
    ];

    // Create projects with error handling for each
    for (const projectData of projectsData) {
      try {
        // Assign random owner and team members
        const owner = users[Math.floor(Math.random() * users.length)];
        const teamSize = Math.min(3, users.length - 1);
        const team = [];
        
        // Add unique team members (excluding owner)
        const potentialTeamMembers = users.filter(user => user._id.toString() !== owner._id.toString());
        for (let i = 0; i < Math.min(teamSize, potentialTeamMembers.length); i++) {
          const randomIndex = Math.floor(Math.random() * potentialTeamMembers.length);
          team.push(potentialTeamMembers[randomIndex]._id);
          // Remove selected user to avoid duplicates
          potentialTeamMembers.splice(randomIndex, 1);
        }

        // Assign tasks to random users
        if (projectData.tasks) {
          projectData.tasks.forEach(task => {
            if (Math.random() > 0.3) { // 70% chance to assign task
              const assignees = [];
              const numAssignees = Math.floor(Math.random() * 3) + 1;
              const availableUsers = users.filter(user => !assignees.includes(user._id));
              
              for (let i = 0; i < Math.min(numAssignees, availableUsers.length); i++) {
                const randomIndex = Math.floor(Math.random() * availableUsers.length);
                assignees.push(availableUsers[randomIndex]._id);
                availableUsers.splice(randomIndex, 1);
              }
              task.assignedTo = assignees;
            }
          });
        }

        // Assign createdBy to resources
        if (projectData.resources) {
          projectData.resources = projectData.resources.map(resource => ({
            ...resource,
            createdBy: owner._id
          }));
        }

        const project = new Project({
          ...projectData,
          owner: owner._id,
          team: team
        });

        await project.save();
        console.log(`Project created: ${project.name}`);
      } catch (error) {
        console.error(`Error creating project ${projectData.name}:`, error);
      }
    }

    console.log('Project seeding complete');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Error seeding projects:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedProjects();