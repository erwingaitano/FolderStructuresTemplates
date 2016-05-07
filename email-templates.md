- Test with https://putsmail.com/

# BODY
  - only use margin in the body. If you need separation between elements,
    use padding-right or <td width='3'></td>

# TABLES
  - nested table should have own inherited styles. For example, if an outer
    table has text-align: center; the inner table won't be affected by this rule.

# IMAGES
  - should never be display: block;
  - use min-height max-height instead of height