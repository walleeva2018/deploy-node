const religionCasteData = [
  {
    religion: 'Hinduism',
    castes: ['Brahmins', 'Kshatriyas', 'Vaishyas', 'Sudras', 'Other']
  },
  {
    religion: 'Islam',
    castes: ['Sunni', 'Shia', 'Hanafi', 'Deobandi', 'Other']
  },
  {
    religion: 'Christianity',
    castes: ['Catholicism', 'Protestantism', 'Eastern Orthodoxy', 'Other']
  },
  {
    religion: 'Sikhism',
    castes: ['Jat', 'Khatri', 'Ramgarhia', 'Ramdasia', 'Other']
  },
  {
    religion: 'Buddhism',
    castes: ['Theravada', 'Mahayana', 'Vajrayana', 'Other']
  },
  {
    religion: 'Jainism',
    castes: ['Digambara', 'Svetambara', 'Other']
  },
  {
    religion: 'Judaism',
    castes: ['Orthodox', 'Conservative', 'Reform', 'Other']
  },
  {
    religion: 'Other',
    castes: ['Not Available']
  }
];

function getCastesByReligion(religion) {
  const mapping = religionCasteData.find(item => item.religion === religion);
  return mapping ? mapping.castes : [];
}

function getAllReligions() {
  return religionCasteData.map(item => item.religion);
}

function getAllReligionCasteData() {
  return religionCasteData;
}

module.exports = {
  religionCasteData,
  getCastesByReligion,
  getAllReligions,
  getAllReligionCasteData
};
