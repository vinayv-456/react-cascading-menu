export const menuGroup = {
  id: "1_101",
  groupHeading: "Country",
  options: [
    {
      id: "2_101",
      label: "United States",
      value: "United States",
      groupHeading: "State",
      options: [
        {
          id: "3_101",
          label: "New York",
          value: "New York",
          groupHeading: "City",
          options: [
            {
              id: "4_101",
              label: "New York City",
              value: "New York City",
              groupHeading: "Place",
              isMultiSelection: false,
              options: [
                {
                  id: "5_101",
                  label: "Statue of Liberty",
                  value: "Statue of Liberty",
                },
                {
                  id: "5_102",
                  label: "Central Park",
                  value: "Central Park",
                },
                {
                  id: "5_103",
                  label: "Empire State Building",
                  value: "Empire State Building",
                },
              ],
            },
          ],
        },
        {
          id: "3_102",
          label: "California",
          value: "California",
          groupHeading: "City",
          options: [
            {
              id: "4_104",
              label: "Los Angeles",
              value: "Los Angeles",
              groupHeading: "Place",
              options: [
                {
                  id: "5_105",
                  label: "Hollywood Walk of Fame",
                  value: "Hollywood Walk of Fame",
                },
                {
                  id: "5_106",
                  label: "Universal Studios Hollywood",
                  value: "Universal Studios Hollywood",
                },
              ],
            },
            {
              id: "4_105",
              label: "San Francisco",
              value: "San Francisco",
              groupHeading: "Place",
              options: [
                {
                  id: "5_107",
                  label: "Golden Gate Bridge",
                  value: "Golden Gate Bridge",
                },
                {
                  id: "5_108",
                  label: "Alcatraz Island",
                  value: "Alcatraz Island",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "2_102",
      label: "France",
      value: "France",
      groupHeading: "State",
      options: [
        {
          id: "3_103",
          label: "Île-de-France",
          value: "Île-de-France",
          groupHeading: "City",
          options: [
            {
              id: "4_106",
              label: "Paris",
              value: "Paris",
              groupHeading: "Place",
              options: [
                {
                  id: "5_109",
                  label: "Eiffel Tower",
                  value: "Eiffel Tower",
                },
                {
                  id: "5_110",
                  label: "Louvre Museum",
                  value: "Louvre Museum",
                },
              ],
            },
          ],
        },
        {
          id: "3_104",
          label: "Provence-Alpes-Côte d'Azur",
          value: "Provence-Alpes-Côte d'Azur",
          groupHeading: "City",
          options: [
            {
              id: "4_107",
              label: "Nice",
              value: "Nice",
              groupHeading: "Place",
              options: [
                {
                  id: "5_111",
                  label: "Promenade des Anglais",
                  value: "Promenade des Anglais",
                },
                {
                  id: "5_112",
                  label: "Castle Hill",
                  value: "Castle Hill",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "2_103",
      label: "Italy",
      value: "Italy",
      groupHeading: "State",
      options: [
        {
          id: "3_105",
          label: "Lazio",
          value: "Lazio",
          groupHeading: "City",
          options: [
            {
              id: "4_108",
              label: "Rome",
              value: "Rome",
              groupHeading: "Place",
              options: [
                {
                  id: "5_113",
                  label: "Colosseum",
                  value: "Colosseum",
                },
                {
                  id: "5_114",
                  label: "Vatican City",
                  value: "Vatican City",
                },
              ],
            },
          ],
        },
        {
          id: "3_106",
          label: "Tuscany",
          value: "Tuscany",
          groupHeading: "City",
          options: [
            {
              id: "4_109",
              label: "Florence",
              value: "Florence",
              groupHeading: "Place",
              options: [
                {
                  id: "5_115",
                  label: "Florence Cathedral",
                  value: "Florence Cathedral",
                },
                {
                  id: "5_116",
                  label: "Uffizi Gallery",
                  value: "Uffizi Gallery",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "2_104",
      label: "India",
      value: "India",
      groupHeading: "State",
      options: [
        {
          id: "3_107",
          label: "Maharashtra",
          value: "Maharashtra",
          groupHeading: "City",
          options: [
            {
              id: "4_110",
              label: "Mumbai",
              value: "Mumbai",
              groupHeading: "Place",
              options: [
                {
                  id: "5_117",
                  label: "Gateway of India",
                  value: "Gateway of India",
                },
                {
                  id: "5_118",
                  label: "Marine Drive",
                  value: "Marine Drive",
                },
              ],
            },
            {
              id: "4_111",
              label: "Pune",
              value: "Pune",
              groupHeading: "Place",
              options: [
                {
                  id: "5_119",
                  label: "Shaniwar Wada",
                  value: "Shaniwar Wada",
                },
                {
                  id: "5_120",
                  label: "Aga Khan Palace",
                  value: "Aga Khan Palace",
                },
              ],
            },
          ],
        },
        {
          id: "3_108",
          label: "Rajasthan",
          value: "Rajasthan",
          groupHeading: "City",
          options: [
            {
              id: "4_112",
              label: "Jaipur",
              value: "Jaipur",
              groupHeading: "Place",
              options: [
                {
                  id: "5_121",
                  label: "Hawa Mahal",
                  value: "Hawa Mahal",
                },
                {
                  id: "5_122",
                  label: "Amer Fort",
                  value: "Amer Fort",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const preSelection = [
  {},
  {},
  {
    id: "2_103",
    label: "Italy",
    value: "Italy",
    groupHeading: "Country",
    parentId: "1_101",
    childGroup: "State",
    childIds: ["3_106", "3_105"],
    options: [
      {
        id: "3_106",
        label: "Tuscany",
        value: "Tuscany",
        groupHeading: "State",
        parentId: "2_103",
        parentGroup: "Country",
        childGroup: "City",
        childIds: ["4_109"],
        options: [
          {
            id: "4_109",
            label: "Florence",
            value: "Florence",
            groupHeading: "City",
            parentId: "3_106",
            parentGroup: "State",
            childGroup: "Place",
            childIds: ["5_116", "5_115"],
            options: [
              {
                id: "5_116",
                label: "Uffizi Gallery",
                value: "Uffizi Gallery",
                groupHeading: "Place",
                parentId: "4_109",
                parentGroup: "City",
                options: [],
              },
              {
                id: "5_115",
                label: "Florence Cathedral",
                value: "Florence Cathedral",
                groupHeading: "Place",
                parentId: "4_109",
                parentGroup: "City",
                options: [],
              },
            ],
          },
        ],
      },
      {
        id: "3_105",
        label: "Lazio",
        value: "Lazio",
        groupHeading: "State",
        parentId: "2_103",
        parentGroup: "Country",
        childGroup: "City",
        childIds: ["4_108"],
        options: [
          {
            id: "4_108",
            label: "Rome",
            value: "Rome",
            groupHeading: "City",
            parentId: "3_105",
            parentGroup: "State",
            childGroup: "Place",
            childIds: ["5_113", "5_114"],
            options: [
              {
                id: "5_113",
                label: "Colosseum",
                value: "Colosseum",
                groupHeading: "Place",
                parentId: "4_108",
                parentGroup: "City",
                options: [],
              },
              {
                id: "5_114",
                label: "Vatican City",
                value: "Vatican City",
                groupHeading: "Place",
                parentId: "4_108",
                parentGroup: "City",
                options: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {},
];
