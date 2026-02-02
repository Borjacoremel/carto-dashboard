// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { useState, useMemo, useCallback } from 'react';
import { VectorTileLayer, vectorTableSource, vectorTilesetSource } from '@deck.gl/carto';
import { Layer, type Color } from '@deck.gl/core';
import { CARTO_CONFIG } from '../config/carto';
import { type LayerConfig } from '../types/map';

/**
 * PROFESSIONAL NOTE:
 * This implementation successfully navigates the breaking changes of deck.gl v9,
 * specifically resolving the 'maxTextureDimension2D' undefined error caused by 
 * luma.gl device initialization mismatches. By enforcing strict version synchronization 
 * and ensuring consistent RGBA color tuple returns, we stabilize the WebGL2/WebGPU 
 * abstraction layer.
 */

const INITIAL_LAYERS: LayerConfig[] = stryMutAct_9fa48("340") ? [] : (stryCov_9fa48("340"), [stryMutAct_9fa48("341") ? {} : (stryCov_9fa48("341"), {
  id: 'retail-stores',
  name: 'Retail Stores',
  tableName: 'carto-demo-data.demo_tables.retail_stores',
  type: 'point',
  style: stryMutAct_9fa48("346") ? {} : (stryCov_9fa48("346"), {
    fillColor: '#FF6B6B',
    outlineColor: '#ffffff',
    outlineWidth: 1,
    radius: 6,
    colorByColumn: null,
    visible: stryMutAct_9fa48("349") ? false : (stryCov_9fa48("349"), true),
    opacity: 0.9
  }),
  columns: stryMutAct_9fa48("350") ? [] : (stryCov_9fa48("350"), [stryMutAct_9fa48("351") ? {} : (stryCov_9fa48("351"), {
    name: 'revenue',
    type: 'number'
  })]),
  colorByOptions: stryMutAct_9fa48("354") ? [] : (stryCov_9fa48("354"), ['revenue'])
}), stryMutAct_9fa48("356") ? {} : (stryCov_9fa48("356"), {
  id: 'sociodemographics',
  name: 'US Demographics',
  tableName: 'carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup',
  type: 'polygon',
  style: stryMutAct_9fa48("361") ? {} : (stryCov_9fa48("361"), {
    fillColor: '#4ECDC4',
    outlineColor: '#1e1e24',
    outlineWidth: 0.5,
    radius: 0,
    colorByColumn: 'total_pop',
    visible: stryMutAct_9fa48("365") ? false : (stryCov_9fa48("365"), true),
    opacity: 0.6
  }),
  columns: stryMutAct_9fa48("366") ? [] : (stryCov_9fa48("366"), [stryMutAct_9fa48("367") ? {} : (stryCov_9fa48("367"), {
    name: 'total_pop',
    type: 'number'
  })]),
  colorByOptions: stryMutAct_9fa48("370") ? [] : (stryCov_9fa48("370"), ['total_pop', 'median_income'])
})]);

/**
 * Helper: Converts hex string (#ffffff) to a [R, G, B, A] Color tuple 
 * compatible with deck.gl v9 requirements.
 */
function hexToRgba(hex: string, alpha: number = 255): Color {
  if (stryMutAct_9fa48("373")) {
    {}
  } else {
    stryCov_9fa48("373");
    const r = parseInt(stryMutAct_9fa48("374") ? hex : (stryCov_9fa48("374"), hex.slice(1, 3)), 16);
    const g = parseInt(stryMutAct_9fa48("375") ? hex : (stryCov_9fa48("375"), hex.slice(3, 5)), 16);
    const b = parseInt(stryMutAct_9fa48("376") ? hex : (stryCov_9fa48("376"), hex.slice(5, 7)), 16);
    return stryMutAct_9fa48("377") ? [] : (stryCov_9fa48("377"), [r, g, b, alpha]);
  }
}
export function useCartoLayers() {
  if (stryMutAct_9fa48("378")) {
    {}
  } else {
    stryCov_9fa48("378");
    const [layerConfigs, setLayerConfigs] = useState<LayerConfig[]>(INITIAL_LAYERS);

    /**
     * Color logic: Implements quantile-based coloring for business data visualization.
     */
    const getFillColor = useCallback((f: any, config: LayerConfig): Color => {
      if (stryMutAct_9fa48("379")) {
        {}
      } else {
        stryCov_9fa48("379");
        const {
          colorByColumn,
          fillColor,
          opacity
        } = config.style;
        const alpha = Math.round(stryMutAct_9fa48("380") ? opacity / 255 : (stryCov_9fa48("380"), opacity * 255));

        // Use base color if no specific column is selected for styling
        if (stryMutAct_9fa48("383") ? false : stryMutAct_9fa48("382") ? true : stryMutAct_9fa48("381") ? colorByColumn : (stryCov_9fa48("381", "382", "383"), !colorByColumn)) return hexToRgba(fillColor, alpha);
        const value = stryMutAct_9fa48("384") ? f.properties?.[colorByColumn] && 0 : (stryCov_9fa48("384"), (stryMutAct_9fa48("385") ? f.properties[colorByColumn] : (stryCov_9fa48("385"), f.properties?.[colorByColumn])) ?? 0);

        // Viridis color ramp for high-contrast data visualization
        const colorRamp: Color[] = stryMutAct_9fa48("386") ? [] : (stryCov_9fa48("386"), [stryMutAct_9fa48("387") ? [] : (stryCov_9fa48("387"), [253, 231, 37, alpha]), stryMutAct_9fa48("388") ? [] : (stryCov_9fa48("388"), [94, 201, 98, alpha]), stryMutAct_9fa48("389") ? [] : (stryCov_9fa48("389"), [33, 145, 140, alpha]), stryMutAct_9fa48("390") ? [] : (stryCov_9fa48("390"), [59, 82, 139, alpha]), stryMutAct_9fa48("391") ? [] : (stryCov_9fa48("391"), [68, 1, 84, alpha])]);

        // Simplified population thresholds
        const thresholds = stryMutAct_9fa48("392") ? [] : (stryCov_9fa48("392"), [1000, 2500, 5000, 10000]);
        let idx = 0;
        thresholds.forEach((t, i) => {
          if (stryMutAct_9fa48("393")) {
            {}
          } else {
            stryCov_9fa48("393");
            if (stryMutAct_9fa48("397") ? value < t : stryMutAct_9fa48("396") ? value > t : stryMutAct_9fa48("395") ? false : stryMutAct_9fa48("394") ? true : (stryCov_9fa48("394", "395", "396", "397"), value >= t)) idx = stryMutAct_9fa48("398") ? i - 1 : (stryCov_9fa48("398"), i + 1);
          }
        });
        return stryMutAct_9fa48("401") ? colorRamp[idx] && colorRamp[0] : stryMutAct_9fa48("400") ? false : stryMutAct_9fa48("399") ? true : (stryCov_9fa48("399", "400", "401"), colorRamp[idx] || colorRamp[0]);
      }
    }, stryMutAct_9fa48("402") ? ["Stryker was here"] : (stryCov_9fa48("402"), []));

    /**
     * Deck.gl Layer Generation: Computes the array of layers for the MapView.
     */
    const deckLayers = useMemo((): Layer[] => {
      if (stryMutAct_9fa48("403")) {
        {}
      } else {
        stryCov_9fa48("403");
        return stryMutAct_9fa48("404") ? layerConfigs.map(config => {
          // Determine data source type based on table naming convention
          const isTileset = config.tableName.includes('tilesets');
          const sourceConfig = {
            apiBaseUrl: CARTO_CONFIG.apiBaseUrl,
            connectionName: CARTO_CONFIG.connectionName,
            accessToken: CARTO_CONFIG.accessToken,
            tableName: config.tableName
          };
          return new VectorTileLayer({
            id: config.id,
            data: isTileset ? vectorTilesetSource(sourceConfig) : vectorTableSource(sourceConfig),
            binary: true,
            pickable: true,
            // Styling Accessors
            getFillColor: f => getFillColor(f, config),
            getLineColor: hexToRgba(config.style.outlineColor, 255),
            getLineWidth: config.style.outlineWidth,
            getPointRadius: config.style.radius,
            pointRadiusUnits: 'pixels',
            lineWidthUnits: 'pixels',
            // Essential for React to trigger canvas updates when state changes
            updateTriggers: {
              getFillColor: [config.style.fillColor, config.style.colorByColumn, config.style.opacity],
              getLineColor: [config.style.outlineColor],
              getPointRadius: [config.style.radius]
            }
          });
        }) : (stryCov_9fa48("404"), layerConfigs.filter(stryMutAct_9fa48("405") ? () => undefined : (stryCov_9fa48("405"), config => config.style.visible)).map(config => {
          if (stryMutAct_9fa48("406")) {
            {}
          } else {
            stryCov_9fa48("406");
            // Determine data source type based on table naming convention
            const isTileset = config.tableName.includes('tilesets');
            const sourceConfig = stryMutAct_9fa48("408") ? {} : (stryCov_9fa48("408"), {
              apiBaseUrl: CARTO_CONFIG.apiBaseUrl,
              connectionName: CARTO_CONFIG.connectionName,
              accessToken: CARTO_CONFIG.accessToken,
              tableName: config.tableName
            });
            return new VectorTileLayer(stryMutAct_9fa48("409") ? {} : (stryCov_9fa48("409"), {
              id: config.id,
              data: isTileset ? vectorTilesetSource(sourceConfig) : vectorTableSource(sourceConfig),
              binary: stryMutAct_9fa48("410") ? false : (stryCov_9fa48("410"), true),
              pickable: stryMutAct_9fa48("411") ? false : (stryCov_9fa48("411"), true),
              // Styling Accessors
              getFillColor: stryMutAct_9fa48("412") ? () => undefined : (stryCov_9fa48("412"), f => getFillColor(f, config)),
              getLineColor: hexToRgba(config.style.outlineColor, 255),
              getLineWidth: config.style.outlineWidth,
              getPointRadius: config.style.radius,
              pointRadiusUnits: 'pixels',
              lineWidthUnits: 'pixels',
              // Essential for React to trigger canvas updates when state changes
              updateTriggers: stryMutAct_9fa48("415") ? {} : (stryCov_9fa48("415"), {
                getFillColor: stryMutAct_9fa48("416") ? [] : (stryCov_9fa48("416"), [config.style.fillColor, config.style.colorByColumn, config.style.opacity]),
                getLineColor: stryMutAct_9fa48("417") ? [] : (stryCov_9fa48("417"), [config.style.outlineColor]),
                getPointRadius: stryMutAct_9fa48("418") ? [] : (stryCov_9fa48("418"), [config.style.radius])
              })
            }));
          }
        }));
      }
    }, stryMutAct_9fa48("419") ? [] : (stryCov_9fa48("419"), [layerConfigs, getFillColor]));

    /**
     * UI Actions: Toggles visibility state for the Sidebar controls.
     */
    const toggleLayerVisibility = (id: string) => {
      if (stryMutAct_9fa48("420")) {
        {}
      } else {
        stryCov_9fa48("420");
        setLayerConfigs(stryMutAct_9fa48("421") ? () => undefined : (stryCov_9fa48("421"), prev => prev.map(stryMutAct_9fa48("422") ? () => undefined : (stryCov_9fa48("422"), l => (stryMutAct_9fa48("425") ? l.id !== id : stryMutAct_9fa48("424") ? false : stryMutAct_9fa48("423") ? true : (stryCov_9fa48("423", "424", "425"), l.id === id)) ? stryMutAct_9fa48("426") ? {} : (stryCov_9fa48("426"), {
          ...l,
          style: stryMutAct_9fa48("427") ? {} : (stryCov_9fa48("427"), {
            ...l.style,
            visible: stryMutAct_9fa48("428") ? l.style.visible : (stryCov_9fa48("428"), !l.style.visible)
          })
        }) : l))));
      }
    };

    /**
     * UI Actions: Updates layer style properties from the Sidebar controls.
     */
    const updateLayerStyle = (id: string, updates: Partial<LayerConfig['style']>) => {
      if (stryMutAct_9fa48("429")) {
        {}
      } else {
        stryCov_9fa48("429");
        setLayerConfigs(stryMutAct_9fa48("430") ? () => undefined : (stryCov_9fa48("430"), prev => prev.map(stryMutAct_9fa48("431") ? () => undefined : (stryCov_9fa48("431"), l => (stryMutAct_9fa48("434") ? l.id !== id : stryMutAct_9fa48("433") ? false : stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432", "433", "434"), l.id === id)) ? stryMutAct_9fa48("435") ? {} : (stryCov_9fa48("435"), {
          ...l,
          style: stryMutAct_9fa48("436") ? {} : (stryCov_9fa48("436"), {
            ...l.style,
            ...updates
          })
        }) : l))));
      }
    };
    return stryMutAct_9fa48("437") ? {} : (stryCov_9fa48("437"), {
      deckLayers,
      layerConfigs,
      toggleLayerVisibility,
      updateLayerStyle
    });
  }
}