import works from "/data/works.js";

const routes = {
  "": {
    selector: ".home",

    "/illustratore": {
      slug: "/illustratore",
      selector: ".illustratore",
      unmount: "unmount",
      unmountParameter: "illustrator",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["fixed", "loaded"],
      mounted: "mountedFromHome",
    },

    "/designer": {
      slug: "/designer",
      selector: ".designer",
      unmount: "unmount",
      unmountParameter: "director",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["fixed", "loaded"],
      mounted: "mountedFromHome",
    },
  },

  "/designer": {
    selector: ".designer",

    "/lavori": {
      slug: "/lavori",
      selector: ".lavori",
      unmount: "unmountToLavori",
      mount: "mountFromDesigner",
      bodyClasses: ["loaded"],
      mode: "continuous",
    },
  },

  "/illustratore": {
    selector: ".illustratore",
    "/illustrazioni": {
      slug: "/illustrazioni",
      selector: ".illustrazioni",
      unmount: "unmountToIllustrazioni",
      mount: "mountFromIllustratore",
      bodyClasses: ["loaded"],
      mode: "continuous",
    },
  },

  "/illustrazioni": {
    selector: ".illustrazioni",
    "": {
      slug: "",
      selector: ".home",
      unmount: "unmount",
      mount: "mountFromIllustrazioni",
      mode: "sequencial",
      bodyClasses: ["fixed", "loaded"],
      mounted: "mount",
    },

    "/about": {
      slug: "/about",
      selector: ".about",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded"],
      mounted: "mount",
      excludeHeader: true,
      excludeNav: true,
    },

    "/credits": {
      slug: "/credits",
      selector: ".credits",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded", "fixed"],
      mounted: "mount",
      excludeHeader: true,
      excludeNav: true,
    },

    "/lavori": {
      slug: "/lavori",
      selector: ".lavori",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded", "fixed"],
      mounted: "mount",
    },
  },

  "/about": {
    selector: ".about",
    "": {
      slug: "",
      selector: ".home",
      unmount: "unmount",
      mount: "mountFromIllustrazioni",
      mode: "sequencial",
      bodyClasses: ["fixed", "loaded"],
      mounted: "mount",
    },

    "/illustrazioni": {
      slug: "/illustrazioni",
      selector: ".illustrazioni",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded"],
      mounted: "mount",
    },

    "/credits": {
      slug: "/credits",
      selector: ".credits",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded", "fixed"],
      mounted: "mount",
      excludeHeader: true,
      excludeNav: true,
    },

    "/lavori": {
      slug: "/lavori",
      selector: ".lavori",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded", "fixed"],
      mounted: "mount",
    },
  },

  "/credits": {
    selector: ".credits",
    "": {
      slug: "",
      selector: ".home",
      unmount: "unmount",
      mount: "mountFromIllustrazioni",
      mode: "sequencial",
      bodyClasses: ["fixed", "loaded"],
      mounted: "mount",
    },

    "/illustrazioni": {
      slug: "/illustrazioni",
      selector: ".illustrazioni",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded"],
      mounted: "mount",
    },

    "/about": {
      slug: "/about",
      selector: ".about",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded"],
      mounted: "mount",
    },

    "/lavori": {
      slug: "/lavori",
      selector: ".lavori",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded", "fixed"],
      mounted: "mount",
    },
  },

  "/404": {
    selector: ".not-found-page",

    "/illustrazioni": {
      slug: "/illustrazioni",
      selector: ".illustrazioni",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded"],
      mounted: "mount",
    },

    "/about": {
      slug: "/about",
      selector: ".about",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded"],
      mounted: "mount",
    },

    "/lavori": {
      slug: "/lavori",
      selector: ".lavori",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded", "fixed"],
      mounted: "mount",
    },
  },

  "/lavori": {
    selector: ".lavori",

    "/about": {
      slug: "/about",
      selector: ".about",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded"],
      mounted: "mount",
      excludeHeader: true,
      excludeNav: true,
    },

    "/illustrazioni": {
      slug: "/illustrazioni",
      selector: ".illustrazioni",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded"],
      mounted: "mount",
    },

    "/credits": {
      slug: "/credits",
      selector: ".credits",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded", "fixed"],
      mounted: "mount",
      excludeHeader: true,
      excludeNav: true,
    },

    "/lavori": {
      slug: "/lavori",
      selector: ".lavori",
      unmount: "unmount",
      mount: "mount",
      mode: "sequencial",
      bodyClasses: ["loaded", "fixed"],
      mounted: "mount",
    },
  },
};

class WorkDestination {
  constructor(slug) {
    this.slug = `/lavori/${slug}`;
    this.selector = `#project__${slug}`;
    this.unmount = "unmountToProject";
    this.mount = "mountFromProject";
    this.mode = "continuous";
    this.bodyClasses = ["loaded"];
    this.excludeHeader = true;
  }
}

class WorkDestinationFromWorks {
  constructor(slug) {
    this.slug = `/lavori/${slug}`;
    this.selector = `#project__${slug}`;
    this.unmount = "unmountToProject";
    this.mount = "mountFromProjects";
    this.mode = "sequencial";
    this.bodyClasses = ["loaded"];
  }
}

class WorkDestinationFromSimplePage {
  constructor(slug) {
    this.slug = `/lavori/${slug}`;
    this.selector = `#project__${slug}`;
    this.unmount = "unmount";
    this.mount = "mount";
    this.mode = "sequencial";
    this.bodyClasses = ["loaded"];
  }
}

function getWorkDestinations() {
  let workDestinations = {};

  works.forEach((work) => {
    let destination = new WorkDestination(work.slug);
    workDestinations[`/lavori/${work.slug}`] = destination;
  });

  workDestinations["/lavori"] = {
    slug: "/lavori",
    selector: ".lavori",
    unmount: "unmount",
    mount: "mountFromLavoro",
    mode: "sequencial",
    bodyClasses: ["loaded", "fixed"],
    mounted: "mount",
  };

  workDestinations["/credits"] = {
    slug: "/credits",
    selector: ".credits",
    unmount: "unmount",
    mount: "mount",
    mode: "sequencial",
    bodyClasses: ["loaded", "fixed"],
    mounted: "mount",
    excludeHeader: true,
    excludeNav: true,
  };

  workDestinations["/about"] = {
    slug: "/about",
    selector: ".about",
    unmount: "unmount",
    mount: "mount",
    mode: "sequencial",
    bodyClasses: ["loaded"],
    mounted: "mount",
    excludeHeader: true,
    excludeNav: true,
  };

  workDestinations["/illustrazioni"] = {
    slug: "/illustrazioni",
    selector: ".illustrazioni",
    unmount: "unmount",
    mount: "mount",
    mode: "sequencial",
    bodyClasses: ["loaded"],
  };

  return workDestinations;
}

function getWorkDestinationsFromWorks() {
  let workDestinations = {};

  works.forEach((work) => {
    let destination = new WorkDestinationFromWorks(work.slug);
    workDestinations[`/lavori/${work.slug}`] = destination;
  });

  return workDestinations;
}

function getWorkDestinationsFromSimplePage() {
  let workDestinations = {};

  works.forEach((work) => {
    let destination = new WorkDestinationFromSimplePage(work.slug);
    workDestinations[`/lavori/${work.slug}`] = destination;
  });

  return workDestinations;
}

function addWorks() {
  const destinations = getWorkDestinations();
  const destinationsWorks = getWorkDestinationsFromWorks();
  const destinationsSimple = getWorkDestinationsFromSimplePage();

  works.forEach((work) => {
    routes[`/lavori/${work.slug}`] = destinations;
    routes[`/lavori/${work.slug}`].selector = ".project";
  });

  routes["/lavori"] = { ...destinationsWorks, ...routes["/lavori"] };
  routes["/about"] = { ...destinationsSimple, ...routes["/about"] };
  routes["/credits"] = { ...destinationsSimple, ...routes["/credits"] };
  routes["/illustrazioni"] = {
    ...destinationsSimple,
    ...routes["/illustrazioni"],
  };
}

addWorks();

export default routes;
