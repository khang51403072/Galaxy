import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';

interface XRenderHTMLProps {
  html: string;
  width?: number;
  style?: any;
  onLinkPress?: (url: string) => void;
}

interface ParsedCSS {
  [selector: string]: {
    [property: string]: string;
  };
}

interface ParsedElement {
  tag: string;
  text?: string;
  children?: ParsedElement[];
  style?: any;
  className?: string;
  id?: string;
  attributes?: { [key: string]: string };
}

const { width: screenWidth } = Dimensions.get('window');

const cleanText = (text: string) => text.replace(/&nbsp;/g, ' ');

// Simple HTML parser using regex
const parseHTML = (html: string): ParsedElement => {
  // Replace &nbsp; with space globally
  const htmlCleaned = html.replace(/&nbsp;/g, ' ');
  // Remove DOCTYPE, html, head tags and get body content
  const bodyMatch = htmlCleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlCleaned;
  
  return parseElement(bodyContent);
};

const parseElement = (html: string): ParsedElement => {
  // Find the first tag
  const tagMatch = html.match(/<(\w+)([^>]*)>/);
  if (!tagMatch) {
    return { tag: 'text', text: html.trim() };
  }
  
  const tag = tagMatch[1];
  const attributes = parseAttributes(tagMatch[2]);
  const className = attributes.class || attributes.className;
  const id = attributes.id;
  
  // Find closing tag
  const closingTag = `</${tag}>`;
  const closingIndex = html.indexOf(closingTag);
  
  if (closingIndex === -1) {
    // Self-closing tag or no closing tag
    return { tag, className, id, attributes };
  }
  
  // Extract content between opening and closing tags
  const content = html.substring(tagMatch[0].length, closingIndex);
  const text = content.trim();
  
  // Parse children (simplified - just look for nested tags)
  const children: ParsedElement[] = [];
  let currentContent = content;
  
  while (currentContent.length > 0) {
    const childTagMatch = currentContent.match(/<(\w+)([^>]*)>/);
    if (!childTagMatch) {
      // No more tags, remaining is text
      const remainingText = currentContent.trim();
      if (remainingText) {
        children.push({ tag: 'text', text: remainingText });
      }
      break;
    }
    
    // Add text before the tag
    const textBefore = currentContent.substring(0, childTagMatch.index).trim();
    if (textBefore) {
      children.push({ tag: 'text', text: textBefore });
    }
    
    // Parse the child tag
    const childTag = childTagMatch[1];
    const childAttributes = parseAttributes(childTagMatch[2]);
    const childClosingTag = `</${childTag}>`;
    const childClosingIndex = currentContent.indexOf(childClosingTag, childTagMatch.index!);
    
    if (childClosingIndex === -1) {
      // Self-closing child tag
      children.push({ tag: childTag, attributes: childAttributes });
      currentContent = currentContent.substring(childTagMatch.index! + childTagMatch[0].length);
    } else {
      // Child tag with content
      const childContent = currentContent.substring(childTagMatch.index! + childTagMatch[0].length, childClosingIndex);
      const childElement = parseElement(`<${childTag}${childTagMatch[2]}>${childContent}</${childTag}>`);
      children.push(childElement);
      currentContent = currentContent.substring(childClosingIndex + childClosingTag.length);
    }
  }
  
  return {
    tag,
    text: children.length === 0 ? text : undefined,
    children: children.length > 0 ? children : undefined,
    className,
    id,
    attributes,
  };
};

const parseAttributes = (attrString: string): { [key: string]: string } => {
  const attributes: { [key: string]: string } = {};
  const attrMatches = attrString.matchAll(/(\w+)=["']([^"']*)["']/g);
  
  for (const match of attrMatches) {
    attributes[match[1]] = match[2];
  }
  
  return attributes;
};

// Enhanced CSS parser hỗ trợ nhiều loại selectors
const parseCSS = (cssString: string): ParsedCSS => {
  const css: ParsedCSS = {};
  
  // Parse class selectors (.className)
  const classRules = cssString.match(/\.[\w-]+\s*\{[^}]+\}/g) || [];
  classRules.forEach(rule => {
    const selectorMatch = rule.match(/\.([\w-]+)\s*\{/);
    const propertiesMatch = rule.match(/\{([^}]+)\}/);
    
    if (selectorMatch && propertiesMatch) {
      const selector = selectorMatch[1];
      const properties = propertiesMatch[1];
      css[`.${selector}`] = parseCSSProperties(properties);
    }
  });
  
  // Parse element selectors (div, p, span, etc.)
  const elementRules = cssString.match(/(?:^|\s)(div|p|span|h[1-6]|a|ul|li|img|table|tr|td|th)\s*\{[^}]+\}/g) || [];
  elementRules.forEach(rule => {
    const selectorMatch = rule.match(/(div|p|span|h[1-6]|a|ul|li|img|table|tr|td|th)\s*\{/);
    const propertiesMatch = rule.match(/\{([^}]+)\}/);
    
    if (selectorMatch && propertiesMatch) {
      const selector = selectorMatch[1];
      const properties = propertiesMatch[1];
      css[selector] = parseCSSProperties(properties);
    }
  });
  
  // Parse ID selectors (#id)
  const idRules = cssString.match(/#[\w-]+\s*\{[^}]+\}/g) || [];
  idRules.forEach(rule => {
    const selectorMatch = rule.match(/#([\w-]+)\s*\{/);
    const propertiesMatch = rule.match(/\{([^}]+)\}/);
    
    if (selectorMatch && propertiesMatch) {
      const selector = selectorMatch[1];
      const properties = propertiesMatch[1];
      css[`#${selector}`] = parseCSSProperties(properties);
    }
  });
  
  return css;
};

// Parse CSS properties
const parseCSSProperties = (properties: string): { [key: string]: string } => {
  const result: { [key: string]: string } = {};
  const propertyPairs = properties.split(';');
  
  propertyPairs.forEach(pair => {
    const [property, value] = pair.split(':').map(s => s.trim());
    if (property && value) {
      result[property] = value;
    }
  });
  
  return result;
};

// Enhanced CSS to React Native style converter
const cssToRNStyle = (cssProperties: { [key: string]: string }): any => {
  const rnStyle: any = {};
  
  Object.entries(cssProperties).forEach(([property, value]) => {
    switch (property) {
      case 'font-family':
        // Map common fonts
        if (value.includes('Verdana')) rnStyle.fontFamily = 'Verdana';
        else if (value.includes('Arial')) rnStyle.fontFamily = 'Arial';
        else if (value.includes('Helvetica')) rnStyle.fontFamily = 'Helvetica';
        break;
      case 'font-size':
        const fontSize = parseInt(value);
        if (!isNaN(fontSize)) rnStyle.fontSize = fontSize;
        break;
      case 'font-weight':
        if (value === 'bold' || value === '700') rnStyle.fontWeight = 'bold';
        else if (value === 'normal' || value === '400') rnStyle.fontWeight = 'normal';
        else if (value === '100') rnStyle.fontWeight = '100';
        else if (value === '200') rnStyle.fontWeight = '200';
        else if (value === '300') rnStyle.fontWeight = '300';
        else if (value === '500') rnStyle.fontWeight = '500';
        else if (value === '600') rnStyle.fontWeight = '600';
        else if (value === '700') rnStyle.fontWeight = '700';
        else if (value === '800') rnStyle.fontWeight = '800';
        else if (value === '900') rnStyle.fontWeight = '900';
        break;
      case 'color':
        rnStyle.color = value;
        break;
      case 'background-color':
        rnStyle.backgroundColor = value;
        break;
      case 'text-align':
        rnStyle.textAlign = value as any;
        break;
      case 'width':
        if (value === '100%') rnStyle.width = '100%';
        else if (value.includes('%')) {
          const percent = parseInt(value);
          if (!isNaN(percent)) rnStyle.width = `${percent}%`;
        } else if (value.includes('px')) {
          const px = parseInt(value);
          if (!isNaN(px)) rnStyle.width = px;
        }
        break;
      case 'height':
        if (value.includes('px')) {
          const px = parseInt(value);
          if (!isNaN(px)) rnStyle.height = px;
        }
        break;
      case 'display':
        if (value === 'flex') rnStyle.flexDirection = 'row';
        else if (value === 'block') rnStyle.display = 'flex';
        else if (value === 'none') rnStyle.display = 'none';
        break;
      case 'flex-direction':
        rnStyle.flexDirection = value as any;
        break;
      case 'justify-content':
        rnStyle.justifyContent = value as any;
        break;
      case 'align-items':
        rnStyle.alignItems = value as any;
        break;
      case 'gap':
        const gap = parseInt(value);
        if (!isNaN(gap)) rnStyle.gap = gap;
        break;
      case 'margin':
        const margin = parseInt(value);
        if (!isNaN(margin)) rnStyle.margin = margin;
        break;
      case 'margin-top':
        const marginTop = parseInt(value);
        if (!isNaN(marginTop)) rnStyle.marginTop = marginTop;
        break;
      case 'margin-bottom':
        const marginBottom = parseInt(value);
        if (!isNaN(marginBottom)) rnStyle.marginBottom = marginBottom;
        break;
      case 'margin-left':
        const marginLeft = parseInt(value);
        if (!isNaN(marginLeft)) rnStyle.marginLeft = marginLeft;
        break;
      case 'margin-right':
        const marginRight = parseInt(value);
        if (!isNaN(marginRight)) rnStyle.marginRight = marginRight;
        break;
      case 'padding':
        const padding = parseInt(value);
        if (!isNaN(padding)) rnStyle.padding = padding;
        break;
      case 'padding-top':
        const paddingTop = parseInt(value);
        if (!isNaN(paddingTop)) rnStyle.paddingTop = paddingTop;
        break;
      case 'padding-bottom':
        const paddingBottom = parseInt(value);
        if (!isNaN(paddingBottom)) rnStyle.paddingBottom = paddingBottom;
        break;
      case 'padding-left':
        const paddingLeft = parseInt(value);
        if (!isNaN(paddingLeft)) rnStyle.paddingLeft = paddingLeft;
        break;
      case 'padding-right':
        const paddingRight = parseInt(value);
        if (!isNaN(paddingRight)) rnStyle.paddingRight = paddingRight;
        break;
      case 'border':
        if (value.includes('dashed')) {
          rnStyle.borderStyle = 'dashed';
          rnStyle.borderColor = 'black';
          rnStyle.borderWidth = 1;
        } else if (value.includes('solid')) {
          rnStyle.borderStyle = 'solid';
          rnStyle.borderColor = 'black';
          rnStyle.borderWidth = 1;
        }
        break;
      case 'border-top':
      case 'border-bottom':
        if (value.includes('dashed')) {
          rnStyle.borderStyle = 'dashed';
          rnStyle.borderColor = 'black';
          if (property === 'border-top') rnStyle.borderTopWidth = 1;
          if (property === 'border-bottom') rnStyle.borderBottomWidth = 1;
        } else if (value.includes('solid')) {
          rnStyle.borderStyle = 'solid';
          rnStyle.borderColor = 'black';
          if (property === 'border-top') rnStyle.borderTopWidth = 1;
          if (property === 'border-bottom') rnStyle.borderBottomWidth = 1;
        }
        break;
      case 'border-radius':
        const borderRadius = parseInt(value);
        if (!isNaN(borderRadius)) rnStyle.borderRadius = borderRadius;
        break;
      case 'position':
        if (value === 'relative') rnStyle.position = 'relative';
        else if (value === 'absolute') rnStyle.position = 'absolute';
        break;
      case 'white-space':
        if (value === 'nowrap') rnStyle.whiteSpace = 'nowrap';
        break;
      case 'text-decoration':
        if (value === 'underline') rnStyle.textDecorationLine = 'underline';
        break;
      case 'list-style':
        if (value === 'none') rnStyle.listStyleType = 'none';
        break;
      case 'overflow':
        rnStyle.overflow = value as any;
        break;
    }
  });
  
  return rnStyle;
};

// Get computed styles for an element
const getComputedStyles = (element: ParsedElement, css: ParsedCSS): any => {
  let computedStyle: any = {};
  
  // Apply element styles (div, p, span, etc.)
  if (css[element.tag]) {
    computedStyle = { ...computedStyle, ...cssToRNStyle(css[element.tag]) };
  }
  
  // Apply class styles
  if (element.className) {
    const classNames = element.className.split(' ');
    classNames.forEach(className => {
      if (css[`.${className}`]) {
        computedStyle = { ...computedStyle, ...cssToRNStyle(css[`.${className}`]) };
      }
    });
  }
  
  // Apply ID styles
  if (element.id && css[`#${element.id}`]) {
    computedStyle = { ...computedStyle, ...cssToRNStyle(css[`#${element.id}`]) };
  }
  
  return computedStyle;
};

// Apply styles to parsed element
const applyStyles = (element: ParsedElement, css: ParsedCSS): ParsedElement => {
  element.style = getComputedStyles(element, css);
  
  if (element.children) {
    element.children = element.children.map(child => applyStyles(child, css));
  }
  
  return element;
};

// Enhanced element renderer
const renderElement = (element: ParsedElement, key: string = '0', onLinkPress?: (url: string) => void): React.ReactElement => {
  const { tag, text, children, style, className, attributes } = element;
  
  // Table layout
  if (tag === 'table') {
    return (
      <View key={key} style={[{ width: '100%' }, style]}>
        {children?.map((child, index) => renderElement(child, `${key}-${index}`, onLinkPress))}
      </View>
    );
  }
  if (tag === 'tr') {
    // Spacing row
    if (attributes?.style?.includes('height:10px')) {
      return <View key={key} style={{ height: 10 }} />;
    }
    return (
      <View key={key} style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
        {children?.map((child, index) => renderElement(child, `${key}-${index}`, onLinkPress))}
      </View>
    );
  }
  if (tag === 'td' || tag === 'th') {
    const isRightColumn = className?.includes('column-right');
    const isQtyLeft = className?.includes('qty-left');
    const isFirstCol = className?.includes('first-col');
    const isMidCol = className?.includes('mid-col');
    const isLastCol = className?.includes('last-col');
    return (
      <Text
        key={key}
        style={[
          { fontSize: 13, paddingHorizontal: 2 },
          isRightColumn && { textAlign: 'right', width: 70 },
          isQtyLeft && { width: 30 },
          isFirstCol && { width: '5%' },
          isMidCol && { width: '67%' },
          isLastCol && { width: '28%' },
          style,
        ]}
      >
        {children && children.length > 0
          ? children.map((child, index) => renderElement(child, `${key}-${index}`, onLinkPress))
          : cleanText(text || '')}
      </Text>
    );
  }
  if (tag === 'hr' && className === 'dashed') {
    return (
      <View
        key={key}
        style={{
          borderTopWidth: 1,
          borderStyle: 'dashed',
          borderColor: '#000',
          marginVertical: 6,
        }}
      />
    );
  }
  if (tag === 'div' && className?.includes('ticket-name')) {
    return (
      <View key={key} style={[{ flexDirection: 'row', gap: 20, fontWeight: 'bold', marginBottom: 4 }, style]}>
        {children?.map((child, index) => renderElement(child, `${key}-${index}`, onLinkPress))}
      </View>
    );
  }
  if (tag === 'div' && className?.includes('time')) {
    return (
      <Text key={key} style={[{ fontSize: 13, marginBottom: 4 }, style]}>
        {cleanText(text || '')}
      </Text>
    );
  }
  if (tag === 'div' && className?.includes('bill-render-work-order')) {
    return (
      <View key={key} style={[{ width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 12 }, style]}>
        {children?.map((child, index) => renderElement(child, `${key}-${index}`, onLinkPress))}
      </View>
    );
  }
  if (tag === 'b' || tag === 'strong') {
    return (
      <Text key={key} style={[{ fontWeight: 'bold' }, style]}>
        {children && children.length > 0
          ? children.map((child, index) => renderElement(child, `${key}-${index}`, onLinkPress))
          : cleanText(text || '')}
      </Text>
    );
  }
  if (tag === 'p' || tag === 'span') {
    return (
      <Text key={key} style={style}>
        {children && children.length > 0
          ? children.map((child, index) => renderElement(child, `${key}-${index}`, onLinkPress))
          : cleanText(text || '')}
      </Text>
    );
  }
  // Default: render children nếu có, nếu không thì render text trong <Text>
  if (children && children.length > 0) {
    return (
      <View key={key} style={style}>
        {children.map((child, index) =>
          renderElement(child, `${key}.${index}`, onLinkPress)
        )}
      </View>
    );
  } else if (text && cleanText(text || '').trim() !== '') {
    return (
      <Text key={key} style={style}>
        {cleanText(text || '')}
      </Text>
    );
  } else {
    return <View key={key} style={style} />;
  }
};

const XRenderHTML: React.FC<XRenderHTMLProps> = ({ html, width = screenWidth - 32, style, onLinkPress }) => {
  const parsedContent = useMemo(() => {
    try {
      // Extract CSS from style tag
      const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      const cssString = cssMatch ? cssMatch[1] : '';
      const css = parseCSS(cssString);
      
      // Parse HTML content
      const parsedElement = parseHTML(html);
      
      // Apply styles
      return applyStyles(parsedElement, css);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return null;
    }
  }, [html]);
  
  if (!parsedContent) {
    return (
      <View style={[{ width, backgroundColor: '#f0f0f0', padding: 16 }, style]}>
        <Text>Error parsing HTML content</Text>
      </View>
    );
  }
  
  return (
    <View style={[{ width }, style]}>
      {renderElement(parsedContent, '0', onLinkPress)}
    </View>
  );
};

export default XRenderHTML; 