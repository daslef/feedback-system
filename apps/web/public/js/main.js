// HEADER
function changeMainDesktopHeaderAppearence() {
    let d = 0;

    const header = document.querySelector(".header-container");
    if (!header) return;

    const topLogosRow = document.querySelector(".top-logos");
    if (!topLogosRow) return;
    d += topLogosRow.offsetHeight;

    window.scrollY > d
        ? header.classList.add("fixed")
        : header.classList.remove("fixed");
}

function toggleMobileNavVisibility() {
    const mobileHeader = document.querySelector(".mobile-header");
    if (!mobileHeader) return;

    const html = document.querySelector("html");

    if (mobileHeader.classList.contains("nav-opened")) {
        resetMobileNavVisibility();
        window.scrollBy(0, Math.abs(parseInt(document.body.style.top)));
        return;
    }

    const scrollTop = window.pageYOffset;

    mobileHeader.classList.add("nav-opened");
    html.classList.add("lock");

    document.body.style.top = -scrollTop + "px";
}

function resetMobileNavVisibility() {
    const mobileHeader = document.querySelector(".mobile-header");
    if (!mobileHeader) return;

    const html = document.querySelector("html");

    mobileHeader.classList.remove("nav-opened");
    html.classList.remove("lock");
}

function setActiveHeader() {
    return window.matchMedia("(min-width: 1024px)").matches
        ? "desktop"
        : "mobile";
}

document.addEventListener("DOMContentLoaded", (event) => {
    changeMainDesktopHeaderAppearence();

    let activeHeader = setActiveHeader();

    window.addEventListener("resize", (event) => {
        if (window.matchMedia("(min-width: 1024px)").matches) {
            resetMobileNavVisibility();
            activeHeader = "desktop";
        }
    });

    document.addEventListener("click", (event) => {
        const openMobileMenuButton = event.target.closest(".open-mobile-menu");
        if (openMobileMenuButton) {
            toggleMobileNavVisibility();
        }
    });

    window.addEventListener("scroll", (event) => {
        changeMainDesktopHeaderAppearence();
    });
});
// HEADER END

// FORMS
document.addEventListener("DOMContentLoaded", (event) => {
    document.addEventListener("input", (event) => {
        let target = event.target;
        if (target.tagName !== "INPUT") return;

        let otherVariantBlock = target.closest(".other-variant");
        if (!otherVariantBlock) return;

        let otherVariantContent = otherVariantBlock.querySelector("textarea");
        if (!otherVariantContent) return;

        otherVariantContent.disabled = target.checked ? false : true;
    });
});
// FORMS END

// PROJECTS PAGE

let projectsMap = null;
let projectsData = null;

let projectsCollection = [];
let objectManager;

function preparePlacemarkCoords(coordStr) {
    const parts = coordStr.split(",");
    if (parts.length !== 2) return false;

    x = parseFloat(parts[0]);
    y = parseFloat(parts[1]);
    if (!x || !y) return false;

    return [x, y];
}

function initProjectsMapPlacemarks() {
    if (!projectsMap) return false;

    fetch('/getProjectItems.json')
        .then(response => response.json())
        .then(d => {
            if (d.list) {
                projectsData = Object.values(d.list);
                projectsData.forEach(function (item, i) {
                    const coords = preparePlacemarkCoords(item.coordinates);
                    if (!coords) return;

                    const feature = {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: coords,
                        },
                        id: i,
                        properties: {
                            typeStatus: item.status,
                            typeYear: item.year,
                            typeSegment: item.segment_title,
                            typeRegion: item.region,
                            hint: item.title,
                            clusterCaption: item.title,
                            balloonContentHeader: `<div class="projects-map-item-title">${item.title}</div>`,
                            balloonContentBody:
                                `<ul class="projects-map-item-info">
                                ${item.segment_title ? `<li><strong>Сегмент:</strong> ${item.segment_title}</li>` : ""}
                                ${item.status ? `<li><strong>Статус:</strong> ${item.status}</li>` : ""}
                                ${item.region ? `<li><strong>Район:</strong> ${item.region}</li>` : ""}
                                ${item.year ? `<li><strong>Год:</strong> ${item.year} г.</li>` : ""}
                                </ul>
                                ${item.link ? `<a href="${item.link}" target="_blank" class="projects-map-item-link btn btn-regular btn-green">Подробнее</a>` : ""}
                                `,
                        },
                        options: {
                            iconLayout: 'default#image',
                            iconImageHref: item.segment_img,
                            iconImageSize: [20, 20],
                            iconImageOffset: [-10, -10],
                        }
                    }

                    projectsCollection.push(feature);
                });
                objectManager = new ymaps.ObjectManager();

                objectManager.add(projectsCollection);
                projectsMap.geoObjects.add(objectManager);
                projectsMap.setBounds(objectManager.getBounds());
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function createProjectsMap(mapBlock) {
    projectsMap = new ymaps.Map(mapBlock, {
        center: [59.938951, 30.315635],
        zoom: 7,
        controls: ["fullscreenControl", "searchControl", "typeSelector", "zoomControl", "geolocationControl"]
    });

    var fullscreenControl = projectsMap.controls.get('fullscreenControl');

    const filterRow = document.querySelector('.filter-row');

    fullscreenControl.events.add("fullscreenenter", function (e) {
        filterRow && filterRow.classList.add('fullscreen');
    });

    fullscreenControl.events.add("fullscreenexit", function (e) {
        filterRow && filterRow.classList.remove('fullscreen');
    });

    initProjectsMapPlacemarks();
}

function filterProjects() {
    // по статусу
    const statusFilterOptions = [];
    let statusFilterQuery;

    const filterItemsChecked = document
        .querySelectorAll('.filter-action[data-type="status"] input:checked ~ span')

    for (const element of filterItemsChecked) {
        statusFilterOptions.push(`properties.typeStatus == "${element.textContent}"`)
    }

    // по году
    const yearFilterOptions = [];
    let yearFilterQuery;

    const yearItemsChecked = document.querySelectorAll('.filter-action[data-type="year"] input:checked ~ span');

    for (const element of yearItemsChecked) {
        yearFilterOptions.push(`properties.typeYear == "${element.textContent}"`)
    }

    // по сегменту
    const segmentFilterOptions = [];
    let segmentFilterQuery;

    const segmentItemsChecked = document.querySelectorAll('.filter-action[data-type="segment"] input:checked ~ span');

    for (const element of segmentItemsChecked) {
        segmentFilterOptions.push(`properties.typeSegment == "${element.textContent}"`)
    }

    // по району
    const regionFilterOptions = [];
    let regionFilterQuery;

    const regionItemsChecked = document.querySelectorAll('.filter-action[data-type="region"] input:checked ~ span');

    for (const element of regionItemsChecked) {
        regionFilterOptions.push(`properties.typeRegion == "${element.textContent}"`)
    }

    const filterOptions = [];

    if (statusFilterOptions.length) {
        statusFilterQuery = statusFilterOptions.join(' || ');
        filterOptions.push(`(${statusFilterQuery})`);
    }

    if (yearFilterOptions.length) {
        yearFilterQuery = yearFilterOptions.join(' || ');
        filterOptions.push(`(${yearFilterQuery})`);
    }

    if (segmentFilterOptions.length) {
        segmentFilterQuery = segmentFilterOptions.join(' || ');
        filterOptions.push(`(${segmentFilterQuery})`);
    }

    if (regionFilterOptions.length) {
        regionFilterQuery = regionFilterOptions.join(' || ');
        filterOptions.push(`(${regionFilterQuery})`);
    }

    if (filterOptions.length) {
        const filterReq = filterOptions.join(' && ');
        objectManager.setFilter(filterReq);
    } else {
        objectManager.setFilter(() => true);
    }

}

function closeActiveFilter() {
    const filterActionActive = document.querySelector('.filter-action.active');
    if (!filterActionActive) return;

    filterActionActive.classList.remove('active');
}

function initFilterList() {
    document.addEventListener('click', function (event) {
        const target = event.target;

        const filterName = target.closest('.filter-name');

        if (filterName) {
            const filterAction = filterName.closest('.filter-action');
            if (filterAction.classList.contains('active')) {
                filterAction.classList.remove('active');
            } else {
                closeActiveFilter();
                filterAction.classList.add('active');
            }
        }

        if (!target.closest('.filter-action')) {
            closeActiveFilter();
        }
    })

    document.addEventListener('change', function (event) {
        const target = event.target;

        if (target.closest('.filter-action')) {
            filterProjects();
        }
    })
}

function createProjectMap(mapBlock) {
    if (!mapBlock) return;

    let mapPlacemark;
    let coords = mapBlock.dataset.coords;
    let img = mapBlock.dataset.img;

    if (!coords || !img) return;

    coords = coords.split(",");

    let objectMap = new ymaps.Map(mapBlock, {
        center: coords,
        zoom: 14,
    });

    mapPlacemark = new ymaps.Placemark(coords, {
        draggable: false,
    }, {
        iconLayout: 'default#image',
        iconImageHref: img,
        iconImageSize: [30, 30],
        iconImageOffset: [-15, -30],
    });

    ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        mapPlacemark.properties.set({
            iconCaption: [
                firstGeoObject.getLocalities().length
                    ? firstGeoObject.getLocalities()
                    : firstGeoObject.getAdministrativeAreas(),
                firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
            ]
                .filter(Boolean)
                .join(", "),
            balloonContent: firstGeoObject.getAddressLine(),
        });
    });

    objectMap.geoObjects.add(mapPlacemark);
}

document.addEventListener("DOMContentLoaded", () => {
    const projectsMapBlock = document.querySelector('.projects-map');
    if (projectsMapBlock && window.ymaps) {

        ymaps.ready(function () {
            createProjectsMap(projectsMapBlock);
        });
    }

    initFilterList();

    const projectMapBlock = document.querySelector('.project-map');
    if (projectMapBlock && window.ymaps) {

        ymaps.ready(function () {
            createProjectMap(projectMapBlock);
        });
    }
});

// PROJECTS PAGE END
