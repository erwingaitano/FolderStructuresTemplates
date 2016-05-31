- Test with https://putsmail.com/

# GENERAL
  - should never be display: block;
  - use min-height max-height and height instead of just height
  - if you use images inside tds (td>img(src='xxx')) make sure to
    set { font-size: 0; line-height: 0; } in the td so there's no space
    above and below
  - avoid using width/height: 100% (except in table, you can use width: 100%)

# BODY
  - only use margin in the body. If you need separation between elements,
    use padding-right or <td width='3'></td>

# TABLES
  - nested table should have own inherited styles. For example, if an outer
    table has text-align: center; the inner table won't be affected by this rule.


# RESPONSIVE
  - To hide and show only DIV elements
    - To hide:
      ```css
      {
        max-height: 0 !important;
        display: none !important;
        mso-hide: all !important;
      }
      ```

    - To Show:
    ```css
    {
      max-height: none !important;
      display: block !important;
    }
    ```
